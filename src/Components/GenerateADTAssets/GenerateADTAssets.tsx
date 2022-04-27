import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DTwin,
    DTwinRelationship,
    DTModel,
    UploadPhase,
    IGenerateADTAssetsProps
} from '../../Models/Constants';
import { useAdapter } from '../../Models/Hooks';
import { UploadProgress } from '../UploadProgress/UploadProgress';
import { AssetTypes } from '../../Models/Constants/Enums';

const GenerateADTAssets: React.FC<IGenerateADTAssetsProps> = ({
    adapter,
    models,
    twins,
    relationships,
    triggerUpload,
    onComplete
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const { t } = useTranslation();

    const pushModelsState = useAdapter({
        adapterMethod: (models: Array<DTModel>) => adapter.createModels(models),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    //set upload progress state based on adapter result
    useEffect(() => {
        if (pushModelsState.adapterResult.errorInfo?.errors?.length) {
            setModelsUploadStatus({
                phase: UploadPhase.Failed,
                message: null,
                errorMessage: t('generateADTAssets.assetsPushError', {
                    assetType: AssetTypes.Models
                })
            });
        } else if (pushModelsState.adapterResult.result) {
            setModelsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: t('generateADTAssets.assetsPushedCount', {
                    count: pushModelsState.adapterResult.getData()?.length,
                    assetType: AssetTypes.Models
                }),
                errorMessage: null
            });
        }
    }, [pushModelsState.adapterResult, t]);

    const updateTwinsUploadProgress = (twinsUploaded, totalTwins) => {
        setTwinsUploadStatus({
            phase: UploadPhase.Uploading,
            message: t('generateADTAssets.uploadProgress', {
                pushed: twinsUploaded,
                total: totalTwins
            }),
            errorMessage: null
        });
    };

    const pushTwinsState = useAdapter({
        adapterMethod: (twins: Array<DTwin>) =>
            adapter.createTwins(twins, updateTwinsUploadProgress),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const updateRelationshipsUploadStatus = (
        relationshipsUploaded,
        totalRelationships
    ) => {
        setRelationshipsUploadStatus({
            phase: UploadPhase.Uploading,
            message: t('generateADTAssets.uploadProgress', {
                pushed: relationshipsUploaded,
                total: totalRelationships
            }),
            errorMessage: null
        });
    };

    const pushRelationshipsState = useAdapter({
        adapterMethod: (relationships: Array<DTwinRelationship>) =>
            adapter.createRelationships(
                relationships,
                updateRelationshipsUploadStatus
            ),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    //set upload progress state based on adapter result
    useEffect(() => {
        if (pushRelationshipsState.adapterResult.errorInfo?.errors?.length) {
            if (pushRelationshipsState.adapterResult.result?.hasNoData()) {
                setRelationshipsUploadStatus({
                    phase: UploadPhase.Failed,
                    message: null,
                    errorMessage: t('generateADTAssets.assetsPushError', {
                        assetType: AssetTypes.Relationships
                    })
                });
            } else {
                setRelationshipsUploadStatus({
                    phase: UploadPhase.PartiallyFailed,
                    message: t('generateADTAssets.assetsPushedCount', {
                        count: pushRelationshipsState.adapterResult.getData()
                            ?.length,
                        assetType: AssetTypes.Relationships
                    }),
                    errorMessage: t('generateADTAssets.partialError', {
                        assetType: AssetTypes.Relationships,
                        errorCount:
                            pushRelationshipsState.adapterResult.errorInfo
                                .errors.length
                    })
                });
            }
        } else if (pushTwinsState.adapterResult.result) {
            setRelationshipsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: t('generateADTAssets.assetsPushedCount', {
                    count: pushRelationshipsState.adapterResult.getData()
                        ?.length,
                    assetType: AssetTypes.Relationships
                }),

                errorMessage: null
            });
        }
    }, [
        pushRelationshipsState.adapterResult,
        pushTwinsState.adapterResult.result,
        t
    ]);

    //set upload progress state based on adapter result
    useEffect(() => {
        if (pushTwinsState.adapterResult.errorInfo?.errors?.length) {
            if (pushTwinsState.adapterResult.result?.hasNoData()) {
                setTwinsUploadStatus({
                    phase: UploadPhase.Failed,
                    message: null,
                    errorMessage: t('generateADTAssets.assetsPushError', {
                        assetType: AssetTypes.Twins
                    })
                });
            } else {
                setTwinsUploadStatus({
                    phase: UploadPhase.PartiallyFailed,
                    message: t('generateADTAssets.assetsPushedCount', {
                        count: pushTwinsState.adapterResult.getData()?.length,
                        assetType: AssetTypes.Twins
                    }),
                    errorMessage: t('generateADTAssets.partialError', {
                        assetType: AssetTypes.Twins,
                        errorCount:
                            pushTwinsState.adapterResult.errorInfo.errors.length
                    })
                });
            }
        } else if (pushTwinsState.adapterResult.result) {
            setTwinsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: t('generateADTAssets.assetsPushedCount', {
                    count: pushTwinsState.adapterResult.getData()?.length,
                    assetType: AssetTypes.Twins
                }),
                errorMessage: null
            });
        }
    }, [pushTwinsState.adapterResult, t]);

    const initiateModelsUpload = useCallback(async () => {
        setModelsUploadStatus({
            phase: UploadPhase.Uploading,
            message: t('generateADTAssets.uploading'),
            errorMessage: null
        });
        return pushModelsState.callAdapter(models);
    }, [models, pushModelsState, t]);

    const initiateTwinsUpload = useCallback(async () => {
        setTwinsUploadStatus({
            phase: UploadPhase.Uploading,
            message: t('generateADTAssets.uploading'),
            errorMessage: null
        });
        return pushTwinsState.callAdapter(twins);
    }, [pushTwinsState, t, twins]);

    const initiateRelationshipsUpload = useCallback(async () => {
        setRelationshipsUploadStatus({
            phase: UploadPhase.Uploading,
            message: t('generateADTAssets.uploading'),
            errorMessage: null
        });
        return pushRelationshipsState.callAdapter(relationships);
    }, [pushRelationshipsState, relationships, t]);

    useEffect(() => {
        (async () => {
            if (!isUploading && triggerUpload) {
                setIsUploading(true);
                const models = await initiateModelsUpload();
                const twins = await initiateTwinsUpload();
                const relationships = await initiateRelationshipsUpload();
                setIsUploading(false);
                onComplete(models, twins, relationships);
            }
        })();
    }, [
        initiateModelsUpload,
        initiateRelationshipsUpload,
        initiateTwinsUpload,
        isUploading,
        onComplete,
        triggerUpload
    ]);

    const initializeUploadStatus = () => {
        return {
            phase: UploadPhase.PreUpload,
            message: null,
            errorMessage: null
        };
    };

    const [modelsUploadStatus, setModelsUploadStatus] = useState(
        initializeUploadStatus()
    );

    const [twinsUploadStatus, setTwinsUploadStatus] = useState(
        initializeUploadStatus()
    );
    const [relationshipsUploadStatus, setRelationshipsUploadStatus] = useState(
        initializeUploadStatus()
    );

    return (
        <UploadProgress
            modelsStatus={modelsUploadStatus}
            twinsStatus={twinsUploadStatus}
            relationshipsStatus={relationshipsUploadStatus}
        />
    );
};

export default GenerateADTAssets;
