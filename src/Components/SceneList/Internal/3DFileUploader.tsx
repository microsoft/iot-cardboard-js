import {
    Checkbox,
    Icon,
    IconButton,
    Image,
    MessageBar,
    MessageBarType,
    PrimaryButton,
    ProgressIndicator
} from '@fluentui/react';
import prettyBytes from 'pretty-bytes';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { AdapterResult } from '../../../Models/Classes';
import BlobsData from '../../../Models/Classes/AdapterDataClasses/BlobsData';
import { Supported3DFileTypes } from '../../../Models/Constants/Enums';
import DropFileIcon from '../../../Resources/Static/dropFile.svg';

interface File3DUploaderProps {
    isOverwriteVisible: boolean;
    isOverwriteChecked: boolean;
    onOverwriteChange: (
        ev?: React.FormEvent<HTMLInputElement | HTMLElement>,
        checked?: boolean
    ) => void;
    onFileChange: (file: File) => void;
    isUploadingFile?: boolean;
    uploadFileAdapterResult?: AdapterResult<BlobsData>;
}

const File3DUploader: React.FC<File3DUploaderProps> = ({
    isOverwriteVisible = false,
    isOverwriteChecked = false,
    onOverwriteChange,
    onFileChange,
    isUploadingFile,
    uploadFileAdapterResult
}) => {
    const { t } = useTranslation();
    const {
        getRootProps,
        getInputProps,
        isFocused,
        // currently react-dropzone's isDragAccept and isDragReject does not fully work with the accepted files that we pass in this component,
        // so styling based on these is not reliable, therefore the style for these states are set with default values
        isDragAccept,
        isDragReject
    } = useDropzone({
        multiple: false,
        accept: Object.values(Supported3DFileTypes)
            .map((t) => '.' + t)
            .join(),
        onDrop: (acceptedFiles) => {
            setSelectedFile(acceptedFiles?.[0]);
            onFileChange(acceptedFiles?.[0]);
        }
    });
    const [selectedFile, setSelectedFile] = useState<File>(null);

    return (
        <>
            {selectedFile ? (
                isUploadingFile ? (
                    <div className="cb-scene-list-form-dialog-3d-file-upload-progress">
                        <Icon
                            iconName="OpenFile"
                            styles={{
                                root: {
                                    fontSize: 16,
                                    paddingTop: 6
                                }
                            }}
                        />
                        <ProgressIndicator
                            label={t('uploadingFile')}
                            styles={{ root: { flexGrow: 1, paddingLeft: 8 } }}
                        />
                    </div>
                ) : uploadFileAdapterResult.result ||
                  uploadFileAdapterResult.errorInfo ? (
                    <MessageBar
                        className="cb-base-fade-in"
                        styles={{ root: { marginBottom: 12 } }}
                        messageBarType={
                            uploadFileAdapterResult.getErrors()?.length > 0
                                ? MessageBarType.error
                                : MessageBarType.success
                        }
                        isMultiline={false}
                        dismissButtonAriaLabel={t('close')}
                    >
                        {uploadFileAdapterResult.getErrors()?.length > 0
                            ? t('uploadProgress.uploadFailed', {
                                  assetType: selectedFile.name
                              })
                            : t('uploadProgress.uploadSuccess', {
                                  assetType: selectedFile.name
                              })}
                    </MessageBar>
                ) : (
                    <div className="cb-scene-list-form-dialog-3d-file-wrapper">
                        <Icon
                            iconName="OpenFile"
                            styles={{
                                root: {
                                    fontSize: 16
                                }
                            }}
                        />
                        <span className="cb-scene-list-form-dialog-3d-file-name">
                            <span>{selectedFile.name}</span>
                            <span>{prettyBytes(selectedFile.size)}</span>
                        </span>
                        <IconButton
                            className="cb-remove-file-button"
                            iconProps={{
                                iconName: 'Cancel'
                            }}
                            title={t('remove')}
                            ariaLabel={t('remove')}
                            onClick={() => {
                                setSelectedFile(null);
                                onFileChange(null);
                            }}
                        />
                    </div>
                )
            ) : (
                <div
                    {...getRootProps({
                        className: `cb-drop-files-container ${
                            isFocused
                                ? 'cb-dropzone-is-focused'
                                : isDragAccept
                                ? 'cb-dropzone-is-drag-accept'
                                : isDragReject
                                ? 'cb-dropzone-is-drag-reject'
                                : ''
                        }`
                    })}
                >
                    <input {...getInputProps()} />
                    <Image
                        shouldStartVisible={true}
                        src={DropFileIcon}
                        className="cb-scene-list-form-dialog-3d-file-dropzone-icon"
                    />
                    <div className="cb-scene-list-form-dialog-3d-file-dropzone-text">
                        <span>{t('fileUploader.dragAndDropFile')}</span>
                        <span>{t('or')}</span>
                    </div>
                    <PrimaryButton>
                        {t('fileUploader.browseFiles')}
                    </PrimaryButton>
                </div>
            )}
            {!isUploadingFile && isOverwriteVisible && (
                <div className="cb-scene-list-form-dialog-3d-file-note cb-base-fade-in">
                    {!isOverwriteChecked && (
                        <MessageBar
                            className="cb-base-fade-in"
                            styles={{ root: { marginBottom: 12 } }}
                            messageBarType={MessageBarType.error}
                            isMultiline={false}
                            dismissButtonAriaLabel={t('close')}
                        >
                            {t('scenes.fileExistsErrorMessage')}
                        </MessageBar>
                    )}
                    <Checkbox
                        onChange={onOverwriteChange}
                        label={t('scenes.overwriteIfExist')}
                        checked={isOverwriteChecked}
                    />
                </div>
            )}
        </>
    );
};

export default File3DUploader;
