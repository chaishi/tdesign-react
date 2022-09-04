import React from 'react';
import { CloseIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import TLoading from '../loading';
import { UploadFile } from './type';
import { abridgeName } from '../_common/js/upload/utils';
import { CommonDisplayFileProps } from './interface';

export type NormalFileProps = CommonDisplayFileProps;

export default function NormalFile(props: NormalFileProps) {
  const prefix = `${props.classPrefix}-upload`;

  const renderProgress = (percent: number) => (
    <div className={`${prefix}__single-progress`}>
      <TLoading />
      <span className={`${prefix}__single-percent`}>{percent}%</span>
    </div>
  );

  // 文本型预览
  const renderFilePreviewAsText = (files: UploadFile[]) => {
    if (props.theme !== 'file') return null;
    return files.map((file, index) => (
      <div className={`${prefix}__single-display-text ${prefix}__display-text--margin`} key={file.name + index}>
        <span className={`${prefix}__single-name`}>
          {file.name}
          {file.status === 'waiting' ? `（${props.locale.progress.waitingText}）` : ''}
        </span>
        {file.status === 'fail' && (
          <small className={classNames(props.errorClasses)} style={{ margin: '0 0 0 -4px' }}>
            （{props.locale.progress.failText}）
          </small>
        )}
        {file.status === 'progress' && renderProgress(file.percent)}
        {(!file.status || file.status === 'success' || !props.autoUpload) && (
          <CloseIcon className={`${prefix}__icon-delete`} onClick={(e) => props.onRemove({ e, file, index })} />
        )}
      </div>
    ));
  };

  // 输入框型预览
  const renderFilePreviewAsInput = () => {
    if (props.theme !== 'file-input') return;
    const file = props.displayFiles[0];
    const inputTextClass = [
      `${props.classPrefix}-input__inner`,
      { [`${prefix}__placeholder`]: !props.displayFiles[0] },
    ];
    return (
      <div className={`${prefix}__single-input-preview ${props.classPrefix}-input`}>
        <div className={classNames(inputTextClass)}>
          <span className={`${prefix}__single-input-text`}>
            {file?.name ? abridgeName(file.name, 4, 6) : props.placeholder}
          </span>
          {file?.status === 'progress' && renderProgress(file.percent)}
          {file?.url && file.status === 'success' && <CheckCircleFilledIcon className={`${prefix}__status-icon`} />}
          {file?.name && file.status === 'fail' && <ErrorCircleFilledIcon className={`${prefix}__status-icon`} />}
          <CloseCircleFilledIcon
            className={`${prefix}__single-input-clear`}
            onClick={(e) => props.onRemove({ e, file, index: 0 })}
          />
        </div>
      </div>
    );
  };

  const { displayFiles } = props;
  const fileListDisplay = props.fileListDisplay?.({ displayFiles });

  const classes = [`${prefix}__single`, `${prefix}__single-${props.theme}`];
  return (
    <div className={classNames(classes)}>
      {props.theme === 'file-input' && renderFilePreviewAsInput()}

      {props.children}

      {props.tips && <small className={classNames(props.tipsClasses)}>{props.tips}</small>}
      {props.theme === 'file' && props.placeholder && !displayFiles[0] && (
        <small className={classNames(props.tipsClasses)}>{props.placeholder}</small>
      )}

      {fileListDisplay || renderFilePreviewAsText(displayFiles)}

      {props.sizeOverLimitMessage && (
        <small className={classNames(props.errorClasses)}>{props.sizeOverLimitMessage}</small>
      )}
      {props.toUploadFiles
        ?.filter((t) => t.response?.error)
        .map((file, index) => (
          <small className={classNames(props.errorClasses)} key={file.name + index}>
            {file.name} {file.response?.error}
          </small>
        ))}
    </div>
  );
}

NormalFile.displayName = 'NormalFile';
