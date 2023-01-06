import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import './ADTModelUploaderCard.scss';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ADTModelUploaderCardProps } from './ADTModelUploaderCard.types';
import JsonUploader from '../../Components/JsonUploader/JsonUploader';
import { MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import useAdapter from '../../Models/Hooks/useAdapter';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTModel } from '../../Models/Constants/Interfaces';
import { ADTModelsData } from '../../Models/Classes/AdapterDataClasses/ADTUploadData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import { UploadPhase } from '../../Models/Constants';
import { BaseCard } from '..';

function ADTModelUploaderCard(props: ADTModelUploaderCardProps, ref) {
    const {
        adapter,
        title,
        theme,
        locale,
        localeStrings,
        hasUploadButton,
        hasMessageBar,
        onUploadFinish,
        onFileListChanged,
        existingFiles
    } = props;
    const { t } = useTranslation();
    const jsonUploaderComponentRef = useRef();
    const [uploadingStatus, setUploadingStatus] = useState(
        UploadPhase.PreUpload
    );
    const [progressMessage, setProgressMessage] = useState(null);

    const pushModelsState = useAdapter({
        adapterMethod: (models: Array<DTDLModel>) =>
            adapter.createModels(models as any),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    useEffect(() => {
        if (pushModelsState.adapterResult.errorInfo?.errors?.length) {
            if (
                pushModelsState.adapterResult.getCatastrophicError()?.rawError
            ) {
                setUploadingStatus(UploadPhase.Failed);
                setProgressMessage(
                    t('uploadProgress.uploadFailed', {
                        assetType: 'models'
                    }) +
                        ': ' +
                        (pushModelsState.adapterResult?.getCatastrophicError()
                            ?.rawError as any).response.data.error.message
                );
            } else {
                setUploadingStatus(UploadPhase.PartiallyFailed);
                setProgressMessage(
                    t('generateADTAssets.partialError', {
                        assetType: 'models',
                        errorCount:
                            pushModelsState.adapterResult.errorInfo.errors
                                .length
                    })
                );
            }
        } else if (pushModelsState.adapterResult?.getData()) {
            setUploadingStatus(UploadPhase.Succeeded);
            setProgressMessage(
                t('uploadProgress.uploadSuccess', {
                    assetType: 'models'
                })
            );
        }

        if (onUploadFinish) {
            onUploadFinish(
                pushModelsState?.adapterResult as AdapterResult<ADTModelsData>
            );
        }
    }, [pushModelsState?.adapterResult]);

    const uploadHandler = () => {
        setProgressMessage(null);
        const jsonItems = (jsonUploaderComponentRef.current as any)?.getJsonItems();
        if (jsonItems.length) {
            const models: Array<DTModel> = jsonItems.map((item) => {
                const model = DTDLModel.fromObject(item);
                return model.trimmedCopy();
            });
            pushModelsState.callAdapter(models);
            setUploadingStatus(UploadPhase.Uploading);
        }
    };

    useImperativeHandle(ref, () => ({
        uploadFiles: uploadHandler,
        getJsonList: () =>
            (jsonUploaderComponentRef.current as any)?.getJsonItems()
    }));

    return (
        <div className="cb-adt-model-uploader-wrapper">
            <BaseCard
                title={title}
                isLoading={false}
                adapterResult={null}
                hideInfoBox={true}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
            >
                <div className="cb-adt-model-uploader">
                    <JsonUploader
                        onFileListChanged={onFileListChanged}
                        ref={jsonUploaderComponentRef}
                        existingFiles={existingFiles}
                    />
                    <div className="cb-adt-model-uploader-footer">
                        {hasMessageBar && progressMessage && (
                            <MessageBar
                                messageBarType={
                                    uploadingStatus === UploadPhase.Succeeded
                                        ? MessageBarType.success
                                        : uploadingStatus ===
                                          UploadPhase.PartiallyFailed
                                        ? MessageBarType.warning
                                        : MessageBarType.error
                                }
                                dismissButtonAriaLabel={t('close')}
                                truncated={true}
                                onDismiss={() => setProgressMessage(null)}
                                className="cb-adt-model-uploader-progress-message"
                            >
                                {progressMessage}
                            </MessageBar>
                        )}
                        {hasUploadButton && (
                            <PrimaryButton
                                onClick={uploadHandler}
                                text={
                                    uploadingStatus === UploadPhase.Uploading
                                        ? t('generateADTAssets.uploading')
                                        : t('upload')
                                }
                                className="cb-adt-model-uploader-button"
                            />
                        )}
                    </div>
                </div>
            </BaseCard>
        </div>
    );
}

export default withErrorBoundary(forwardRef(ADTModelUploaderCard));
