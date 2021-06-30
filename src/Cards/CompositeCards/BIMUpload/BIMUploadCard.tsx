import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BIMFileSelection from '../../../Components/BIMFileSelection/BIMFileSelection';
import {
    BIMFileTypes,
    BIMUploadState,
    UploadPhase
} from '../../../Models/Constants';
import { BIMUploadCardProps } from './BIMUploadCard.types';
import './BIMUploadCard.scss';
import ModelSelection from '../../../Components/ModelSelection/ModelSelection';
import useAssetsFromBIM from '../../../Models/Hooks/useAssetsFromBIM';
import useXeokitRender from '../../../Models/Hooks/useXeokitRender';
import { useAdapter, useGuid } from '../../../Models/Hooks';
import BaseCard from '../../Base/Consume/BaseCard';
import ADTModel from '../../../Models/Classes/ADTAssets/ADTModel';
import { UploadProgress } from '../../../Components/UploadProgress/UploadProgress';

const BIMUploadCard: React.FC<BIMUploadCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();
    const [uploadState, setUploadState] = useState(
        BIMUploadState.PreProcessing
    );
    const canvasGuid = useGuid();

    const [bimFilePath, setBimFilePath] = useState(null);
    const [metadataFilePath, setMetadataFilePath] = useState(null);

    const initializeUploadStatus = () => {
        return {
            phase: UploadPhase.PreUpload,
            message: null
        };
    };

    const [modelsUploadStatus, setModelsUploadStatus] = useState(
        initializeUploadStatus()
    );
    const [twinsUploadStatus, setTwinsUploadStatus] = useState(
        initializeUploadStatus()
    );
    const [relationshipsUploadStatus, setRelaionshipsUploadStatus] = useState(
        initializeUploadStatus()
    );

    const [terminalCondition, setTerminalCondition] = useState({
        isTerminal: false,
        conditionType: null,
        terminationMessage: null
    });

    // TODO: ensure this only happens once I guess?
    useXeokitRender(
        canvasGuid,
        bimFilePath,
        metadataFilePath,
        BIMFileTypes.Xkt,
        () => null
    );
    // as of right now this is the only way I can find that creates the metadata necesary to traverse assets
    const assetsFromBim = useAssetsFromBIM(
        canvasGuid,
        'ghostTree',
        bimFilePath,
        metadataFilePath
    );
    // const [assetsFromBim, setAssetsFromBim] = useState(null) //may not be necessary?
    // useEffect(() => {
    //     bimFilePath && metadataFilePath && setAssetsFromBim(useAssetsFromBIM('', bimFilePath, metadataFilePath, bimFilePath, () => null));
    // }, [bimFilePath, metadataFilePath]);

    const pushModelsState = useAdapter({
        adapterMethod: (models: Array<ADTModel>) =>
            adapter.pushADTModels(models),
        refetchDependencies: [],
        isAdapterCalledOnMount: true
    });

    const initiateModelsUpload = () => {
        setModelsUploadStatus({
            phase: UploadPhase.Uploading,
            message: 'Uploading...'
        });
        pushModelsState.callAdapter(
            assetsFromBim.models.map((model: ADTModel) => model.toDTDL())
        );
    };

    const initiateTwinsUpload = () => {
        setTwinsUploadStatus({
            phase: UploadPhase.Uploading,
            message: 'Uploading...'
        });
        pushModelsState.callAdapter(
            assetsFromBim.twins // TODO - transformation
        );
    };

    const pushTwinsState = useAdapter({
        adapterMethod: (twins: Array<ADTModel>) => adapter.pushADTTwins(twins),
        refetchDependencies: [],
        isAdapterCalledOnMount: true
    });

    const getSectionHeaderText = () => {
        if (uploadState === BIMUploadState.PreProcessing) {
            return 'Specify files to upload from';
        }
        if (uploadState === BIMUploadState.PreUpload) {
            return 'Select models for upload';
        }
        if (uploadState === BIMUploadState.InUpload) {
            return 'Upload progress';
        }
    };

    // on success or failure of pushing models
    useEffect(() => {
        console.log(pushModelsState.adapterResult);
        if (modelsUploadStatus.phase === UploadPhase.Uploading) {
            if (pushModelsState.adapterResult.errorInfo?.errors?.length) {
                setModelsUploadStatus({
                    phase: UploadPhase.Failed,
                    message: 'Upload failed'
                });
            } else if (pushModelsState.adapterResult.result) {
                setModelsUploadStatus({
                    phase: UploadPhase.Succeeded,
                    message: 'Models succesfully uploaded!'
                });
                setTimeout(() => {
                    initiateTwinsUpload();
                }, 1000);
            }
        }
    }, [pushModelsState]);

    const getModelsList = useCallback(() => {
        return assetsFromBim?.models?.map((model) => {
            return model.name;
        });
    }, [assetsFromBim]);

    const onFileSelection = (bimFilePath, metadataFilePath?) => {
        setBimFilePath(bimFilePath);
        metadataFilePath && setMetadataFilePath(metadataFilePath);
        setUploadState(BIMUploadState.PreUpload);
    };

    return (
        <BaseCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
            isLoading={false}
            adapterResult={null}
        >
            <canvas className="cb-ghost" id={canvasGuid}></canvas>
            <div className="cb-ghost" id={'ghostTree'}></div>
            <div className="cb-section-container">
                <div className="cb-section-header">
                    {getSectionHeaderText()}
                </div>
                <div className="cb-section-content">
                    {uploadState === BIMUploadState.PreProcessing && (
                        <BIMFileSelection onSubmit={onFileSelection} />
                    )}
                    {uploadState === BIMUploadState.PreUpload && (
                        <ModelSelection
                            models={getModelsList()}
                            onSubmit={() => {
                                setUploadState(BIMUploadState.InUpload);
                                initiateModelsUpload();
                            }}
                        />
                    )}
                    {uploadState === BIMUploadState.InUpload && (
                        <UploadProgress
                            modelsStatus={modelsUploadStatus}
                            twinsStatus={twinsUploadStatus}
                            relationshipsStatus={relationshipsUploadStatus}
                        />
                    )}
                </div>
            </div>
        </BaseCard>
    );
};

export default React.memo(BIMUploadCard);
