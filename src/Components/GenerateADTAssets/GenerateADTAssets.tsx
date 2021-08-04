import React, { useEffect, useState } from 'react';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTwin, DTwinRelationship, UploadPhase } from '../../Models/Constants';
import { useAdapter } from '../../Models/Hooks';
import { UploadProgress } from '../UploadProgress/UploadProgress';

const GenerateADTAssets = ({
    adapter,
    models,
    twins,
    relationships,
    triggerUpload,
    onComplete
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const pushModelsState = useAdapter({
        adapterMethod: (models: Array<DTDLModel>) =>
            adapter.createModels(models),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    //set upload progress state based on adapter result
    useEffect(() => {
        if (pushModelsState.adapterResult.errorInfo?.errors?.length) {
            setModelsUploadStatus({
                phase: UploadPhase.Failed,
                message: null,
                errorMessage: 'There was an issue while pushing models to ADT'
            });
        } else if (pushModelsState.adapterResult.result) {
            setModelsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: `${
                    pushModelsState.adapterResult.getData()?.length
                } models pushed`,
                errorMessage: null
            });
        }
    }, [pushModelsState.adapterResult]);

    const updateTwinsUploadProgress = (twinsUploaded, totalTwins) => {
        setTwinsUploadStatus({
            phase: UploadPhase.Uploading,
            message: `${twinsUploaded} of ${totalTwins}`,
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
            message: `${relationshipsUploaded} of ${totalRelationships}`,
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
            if (!pushRelationshipsState.adapterResult.result?.hasNoData()) {
                setRelationshipsUploadStatus({
                    phase: UploadPhase.Failed,
                    message: null,
                    errorMessage:
                        'There was an issue while pushing relationships to ADT'
                });
            } else {
                setRelationshipsUploadStatus({
                    phase: UploadPhase.PartiallyFailed,
                    message: null,
                    errorMessage: `Errors while uploading relationships: ${pushRelationshipsState.adapterResult.errorInfo.errors.length} relationships failed to upload`
                });
            }
        } else if (pushTwinsState.adapterResult.result) {
            setRelationshipsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: `${
                    pushRelationshipsState.adapterResult.getData()?.length
                } relationships pushed`,
                errorMessage: null
            });
        }
    }, [pushRelationshipsState.adapterResult]);

    //set upload progress state based on adapter result
    useEffect(() => {
        if (pushTwinsState.adapterResult.errorInfo?.errors?.length) {
            if (!pushTwinsState.adapterResult.result?.hasNoData()) {
                setTwinsUploadStatus({
                    phase: UploadPhase.Failed,
                    message: 'There was an issue while pushing tinws to ADT',
                    errorMessage: 'Twins failed to upload'
                });
            } else {
                setTwinsUploadStatus({
                    phase: UploadPhase.PartiallyFailed,
                    message: 'Partial failure while uploading twins',
                    errorMessage: `Errors while uploading twins: ${pushTwinsState.adapterResult.errorInfo.errors.length} twins failed to upload`
                });
            }
        } else if (pushTwinsState.adapterResult.result) {
            setTwinsUploadStatus({
                phase: UploadPhase.Succeeded,
                message: `${
                    pushTwinsState.adapterResult.getData()?.length
                } twins pushed`,
                errorMessage: null
            });
        }
    }, [pushTwinsState.adapterResult]);

    useEffect(() => {
        (async () => {
            if (isUploading === false) {
                setIsUploading(true);
                await initiateModelsUpload();
                await initiateTwinsUpload();
                await initiateRelationshipsUpload();
                setIsUploading(false);
                onComplete();
            }
        })();
    }, [triggerUpload]);

    const initiateModelsUpload = async () => {
        setModelsUploadStatus({
            phase: UploadPhase.Uploading,
            message: 'Uploading...',
            errorMessage: null
        });
        return pushModelsState.callAdapter(models);
    };

    const initiateTwinsUpload = async () => {
        setTwinsUploadStatus({
            phase: UploadPhase.Uploading,
            message: 'Uploading...',
            errorMessage: null
        });
        return pushTwinsState.callAdapter(twins);
    };

    const initiateRelationshipsUpload = async () => {
        setRelationshipsUploadStatus({
            phase: UploadPhase.Uploading,
            message: 'Uploading...',
            errorMessage: null
        });
        return pushRelationshipsState.callAdapter(relationships);
    };

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
