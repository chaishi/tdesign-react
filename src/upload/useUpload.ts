import { useRef, useState, useMemo, ChangeEventHandler, DragEvent, MouseEvent } from 'react';
import merge from 'lodash/merge';
import { SizeLimitObj, TdUploadProps, UploadFile, UploadRemoveContext } from './type';
import {
  getFilesAndErrors,
  validateFile,
  upload,
  getTriggerTextField,
  getDisplayFiles,
  removeFiles,
} from '../_common/js/upload/main';
import { getFileUrlByFileRaw } from '../_common/js/upload/utils';
import useControlled from '../hooks/useControlled';
import { InnerProgressContext, OnResponseErrorContext, SuccessContext } from '../_common/js/upload/types';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';

/**
 * 上传组件全部逻辑，方便脱离 UI，自定义 UI 组件
 */
export default function useUpload(props: TdUploadProps) {
  const inputRef = useRef();
  // TODO: Form 表单控制上传组件是否禁用
  const { disabled, autoUpload, isBatchUpload } = props;
  const { classPrefix } = useConfig();
  const [globalLocale, t] = useLocaleReceiver('upload');
  const [uploadValue, setUploadValue] = useControlled(props, 'files', props.onChange);
  // TODO: 可能存在多个请求，一个不够
  const [xhrReq, setXhrReq] = useState<XMLHttpRequest>();
  const [toUploadFiles, setToUploadFiles] = useState<UploadFile[]>([]);
  const [sizeOverLimitMessage, setSizeOverLimitMessage] = useState('');

  const locale = useMemo(() => merge({}, globalLocale, props.locale), [globalLocale, props.locale]);

  const tipsClasses = `${classPrefix}-upload__tips ${classPrefix}-size-s`;
  const errorClasses = [tipsClasses].concat(`${classPrefix}-upload__tips-error`);

  // 单文件场景：触发元素文本
  const triggerUploadText = useMemo(() => {
    const field = getTriggerTextField({
      multiple: props.multiple,
      status: uploadValue?.[0]?.status,
    });
    return locale.triggerUploadText[field];
  }, [locale.triggerUploadText, props.multiple, uploadValue]);

  const [uploading, setUploading] = useState(false);

  // 文件列表显示的内容（自动上传和非自动上传有所不同）
  const displayFiles = useMemo(
    () => getDisplayFiles({ multiple: props.multiple, toUploadFiles, uploadValue, autoUpload, isBatchUpload }),
    [props.multiple, toUploadFiles, uploadValue, autoUpload, isBatchUpload],
  );

  const onResponseError = (p: OnResponseErrorContext) => {
    if (!p) return;
    const { response, event, files } = p;
    files?.[0] &&
      props.onOneFileFail?.({
        e: event,
        file: files?.[0],
        currentFiles: files,
        failedFiles: files,
        response,
      });
  };

  const onResponseProgress = (p: InnerProgressContext) => {
    props.onProgress?.({
      e: p.event,
      file: p.file,
      currentFiles: p.files,
      percent: p.percent,
      type: p.type,
    });
  };

  // 只有多个上传请求同时触发时才需 onOneFileSuccess
  const onResponseSuccess = (p: SuccessContext) => {
    if (!props.multiple || props.uploadAllFilesInOneRequest) return;
    props.onOneFileSuccess?.({
      e: p.event,
      file: p.files[0],
      response: p.response,
    });
  };

  function getSizeLimitError(sizeLimitObj: SizeLimitObj) {
    const limit = sizeLimitObj;
    return limit.message
      ? t(limit.message, { sizeLimit: limit.size })
      : `${t(locale.sizeLimitMessage, { sizeLimit: limit.size })} ${limit.unit}`;
  }

  const handleNonAutoUpload = (toFiles: UploadFile[]) => {
    const tmpFiles = props.multiple ? uploadValue.concat(toFiles) : toFiles;
    // 图片需要本地预览
    if (['image', 'image-flow'].includes(props.theme)) {
      const list = tmpFiles.map(
        (file) =>
          new Promise((resolve) => {
            getFileUrlByFileRaw(file.raw).then((url) => {
              resolve({ ...file, url });
            });
          }),
      );
      Promise.all(list).then((files) => {
        setUploadValue(files, {
          trigger: 'add',
          index: uploadValue.length,
          file: files[0],
        });
      });
    } else {
      setUploadValue(tmpFiles, {
        trigger: 'add',
        index: uploadValue.length,
        file: tmpFiles[0],
      });
    }
    setToUploadFiles([]);
  };

  const onFileChange = (files: FileList) => {
    if (props.disabled) return;
    // @ts-ignore
    props.onSelectChange?.([...files], { currentSelectedFiles: toUploadFiles });
    validateFile({
      uploadValue,
      // @ts-ignore
      files: [...files],
      allowUploadDuplicateFile: props.allowUploadDuplicateFile,
      max: props.max,
      sizeLimit: props.sizeLimit,
      isBatchUpload: props.isBatchUpload,
      format: props.format,
      beforeUpload: props.beforeUpload,
      beforeAllFilesUpload: props.beforeAllFilesUpload,
    }).then((args) => {
      // 自定义全文件校验不通过
      if (args.validateResult?.type === 'BEFORE_ALL_FILES_UPLOAD') return;
      // 文件数量校验不通过
      if (args.lengthOverLimit) {
        props.onValidate?.({ type: 'FILES_OVER_LENGTH_LIMIT', files: args.files });
      }
      // 过滤相同的文件名
      if (args.validateResult?.type === 'FILTER_FILE_SAME_NAME') {
        props.onValidate?.({ type: 'FILTER_FILE_SAME_NAME', files: args.files });
      }
      // 文件大小校验结果处理
      if (args.fileValidateList instanceof Array) {
        const { sizeLimitErrors, toFiles } = getFilesAndErrors(args.fileValidateList, getSizeLimitError);
        const tmpWatingFiles = autoUpload ? toFiles : toUploadFiles.concat(toFiles);
        setToUploadFiles(tmpWatingFiles);
        props.onWaitingUploadFilesChange?.({ files: tmpWatingFiles, trigger: 'validate' });
        // 错误信息处理
        if (sizeLimitErrors[0]) {
          setSizeOverLimitMessage(sizeLimitErrors[0].file.response.error);
          props.onValidate?.({ type: 'FILE_OVER_SIZE_LIMIT', files: sizeLimitErrors.map((t) => t.file) });
        }
        setSizeOverLimitMessage('');
        // 如果是自动上传
        if (autoUpload) {
          uploadFiles(toFiles);
        } else {
          handleNonAutoUpload(toFiles);
        }
      }
    });
  };

  const onNormalFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onFileChange?.(e.target.files);
  };

  function onDragFileChange(e: DragEvent<HTMLDivElement>) {
    onFileChange?.(e.dataTransfer.files);
  }

  /**
   * 上传文件
   * 对外暴露方法，修改时需谨慎
   */
  function uploadFiles(toFiles?: UploadFile[]) {
    const notUploadedFiles = uploadValue.filter((t) => t.status !== 'success');
    const files = props.autoUpload ? toFiles || toUploadFiles : notUploadedFiles;
    if (!files || !files.length) return;
    setUploading(true);
    upload({
      action: props.action,
      uploadedFiles: uploadValue,
      toUploadFiles: files,
      multiple: props.multiple,
      isBatchUpload: props.isBatchUpload,
      uploadAllFilesInOneRequest: props.uploadAllFilesInOneRequest,
      useMockProgress: props.useMockProgress,
      data: props.data,
      requestMethod: props.requestMethod,
      formatRequest: props.formatRequest,
      formatResponse: props.formatResponse,
      onResponseProgress,
      onResponseSuccess,
      onResponseError,
      setXhrObject: (val) => {
        setXhrReq(val);
      },
    }).then(({ status, data, list, failedFiles }) => {
      if (status === 'success') {
        if (props.autoUpload) {
          setUploadValue(data.files, {
            e: data.event,
            trigger: 'add',
            index: uploadValue.length,
            file: data.files[0],
          });
        }
        props.onSuccess?.({
          fileList: data.files,
          currentFiles: files,
          // 只有全部请求完成后，才会存在该字段
          results: list?.map((t) => t.data),
        });
      } else if (failedFiles?.[0]) {
        props.onFail({
          e: data.event,
          file: failedFiles[0],
          failedFiles,
          currentFiles: files,
          response: data.response,
        });
      }
      setToUploadFiles(failedFiles);
      props.onWaitingUploadFilesChange?.({ files: failedFiles, trigger: 'uploaded' });

      setUploading(false);
    }, onResponseError);
  }

  function onRemove(p: UploadRemoveContext) {
    setSizeOverLimitMessage('');
    const { newFiles, newToUploadFiles } = removeFiles(uploadValue, toUploadFiles, p);
    // if (props.multiple) {
    if (newFiles.length !== uploadValue.length) {
      setUploadValue(newFiles, {
        e: p.e,
        trigger: 'remove',
        index: p.index,
        file: p.file,
      });
    }
    if (newToUploadFiles.length !== toUploadFiles.length) {
      setToUploadFiles(newToUploadFiles);
      props.onWaitingUploadFilesChange?.({ files: newToUploadFiles, trigger: 'remove' });
    }
    props.onRemove?.(p);
  }

  const triggerUpload = () => {
    if (disabled) return;
    (inputRef.current as HTMLInputElement).click();
  };

  const cancelUpload = (context?: { file?: UploadFile; e?: MouseEvent<HTMLElement> }) => {
    xhrReq?.abort();
    if (context?.file) {
      onRemove?.({ file: context.file, e: context.e, index: 0 });
    }
  };

  return {
    t,
    locale,
    classPrefix,
    triggerUploadText,
    toUploadFiles,
    uploadValue,
    displayFiles,
    sizeOverLimitMessage,
    uploading,
    tipsClasses,
    errorClasses,
    inputRef,
    disabled,
    xhrReq,
    uploadFiles,
    onFileChange,
    onNormalFileChange,
    onDragFileChange,
    onRemove,
    triggerUpload,
    cancelUpload,
  };
}
