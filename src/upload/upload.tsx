import React, { forwardRef } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import NormalFile from './themes/NormalFile';
import DraggerFile from './themes/DraggerFile';
import ImageCard from './themes/ImageCard';
import MultipleFlowList from './themes/MultipleFlowList';
import useUpload from './hooks/useUpload';
import Button from '../button';
import { uploadDefaultProps } from './defaultProps';
import { CommonDisplayFileProps, UploadProps } from './interface';
import { UploadDragEvents } from './hooks/useDrag';
import CustomFile from './themes/CustomFile';

const Upload = forwardRef((props: UploadProps, ref) => {
  const { theme } = props;
  const {
    locale,
    classPrefix,
    triggerUploadText,
    toUploadFiles,
    displayFiles,
    uploadValue,
    sizeOverLimitMessage,
    uploading,
    tipsClasses,
    errorClasses,
    inputRef,
    disabled,
    onRemove,
    uploadFiles,
    onNormalFileChange,
    onDragFileChange,
    triggerUpload,
    cancelUpload,
  } = useUpload(props);

  React.useImperativeHandle(ref, () => ({
    upload: inputRef.current,
    uploading,
    triggerUpload,
    uploadFiles,
    cancelUpload,
  }));

  const renderTrigger = () => {
    const getDefaultTrigger = () => {
      if (theme === 'file-input') {
        return (
          <Button disabled={props.disabled} variant="outline" {...props.triggerButtonProps}>
            {triggerUploadText}
          </Button>
        );
      }
      return (
        <Button disabled={props.disabled} variant="outline" icon={<UploadIcon />} {...props.triggerButtonProps}>
          {triggerUploadText}
        </Button>
      );
    };
    return props.trigger || props.children || getDefaultTrigger();
  };

  const triggerElement = renderTrigger();

  const commonDisplayFileProps: CommonDisplayFileProps = {
    files: uploadValue,
    toUploadFiles,
    displayFiles,
    theme,
    placeholder: props.placeholder,
    disabled: props.disabled,
    tips: props.tips,
    sizeOverLimitMessage,
    uploading,
    classPrefix,
    tipsClasses,
    errorClasses,
    locale,
    autoUpload: props.autoUpload,
    fileListDisplay: props.fileListDisplay,
    onRemove,
  };

  const dragProps: UploadDragEvents = {
    onDragFileChange,
    onDragenter: props.onDragenter,
    onDragleave: props.onDragleave,
    onDrop: props.onDrop,
  };

  const getNormalFileNode = () => (
    <NormalFile {...commonDisplayFileProps} multiple={props.multiple}>
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </NormalFile>
  );

  const getSingleFileDraggerUploadNode = () => (
    <DraggerFile
      {...commonDisplayFileProps}
      dragEvents={dragProps}
      trigger={props.trigger}
      cancelUpload={cancelUpload}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
    />
  );

  const getImageCardUploadNode = () => (
    <ImageCard
      {...commonDisplayFileProps}
      multiple={props.multiple}
      max={props.max}
      showUploadProgress={props.showUploadProgress}
      triggerUpload={triggerUpload}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
      onPreview={props.onPreview}
    />
  );

  const getFlowListNode = () => (
    <MultipleFlowList
      {...commonDisplayFileProps}
      isBatchUpload={props.isBatchUpload}
      draggable={props.draggable}
      dragEvents={dragProps}
      uploadFiles={uploadFiles}
      cancelUpload={cancelUpload}
      onPreview={props.onPreview}
    >
      <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
        {triggerElement}
      </div>
    </MultipleFlowList>
  );

  const getCustomFile = () => (
    <CustomFile
      {...commonDisplayFileProps}
      draggable={props.draggable}
      dragContent={props.dragContent}
      dragEvents={dragProps}
      triggerUpload={triggerUpload}
      childrenNode={props.children}
      trigger={props.trigger}
    >
      {triggerElement}
    </CustomFile>
  );

  return (
    <div className={classNames([props.className, `${classPrefix}-upload`])} style={props.style}>
      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        onChange={onNormalFileChange}
        multiple={props.multiple}
        accept={props.accept}
        hidden
      />
      {['file', 'file-input'].includes(theme) && !props.draggable && getNormalFileNode()}
      {['file', 'image'].includes(theme) && props.draggable && getSingleFileDraggerUploadNode()}
      {theme === 'image' && !props.draggable && getImageCardUploadNode()}
      {['image-flow', 'file-flow'].includes(theme) && getFlowListNode()}
      {theme === 'custom' && getCustomFile()}
    </div>
  );
});

Upload.displayName = 'Upload';

Upload.defaultProps = uploadDefaultProps;

export default Upload;
