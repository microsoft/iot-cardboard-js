import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BIMFileTypes,
    BIMUploadState,
    UploadPhase
} from '../../../Models/Constants';
import { BIMUploadCardProps } from './BIMUploadCard.types';
import './BIMUploadCard.scss';
import useAssetsFromBIM from '../../../Models/Hooks/useAssetsFromBIM';
import useXeokitRender from '../../../Models/Hooks/useXeokitRender';
import { useGuid } from '../../../Models/Hooks';
import BaseCard from '../../Base/Consume/BaseCard';

import {
    Checkbox,
    DefaultButton,
    MessageBar,
    MessageBarType,
    PrimaryButton,
    Spinner
} from '@fluentui/react';
import GenerateADTAssets from '../../../Components/GenerateADTAssets/GenerateADTAssets';

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

    const [isParsingBIM, setIsParsingBIM] = useState(null);

    const [bimFilePath, setBimFilePath] = useState(null);
    const [metadataFilePath, setMetadataFilePath] = useState(null);

    const [generateEnvironmentStatus, setGenerateEnvironmentStatus] = useState(
        UploadPhase.PreUpload
    );

    const bimFileInputRef = useRef(null);
    const metadataFileInputRef = useRef(null);

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
        metadataFilePath,
        (isParsing) => setIsParsingBIM(isParsing)
    );

    // for keeping track of which models pulled from the BIM are selected for upload
    const [modelsDictionary, setModelsDictionary] = useState(null);
    useEffect(() => {
        const newModelsDictionary = {};
        assetsFromBim?.models?.forEach((model) => {
            newModelsDictionary[model.displayName] = true;
        });
        setModelsDictionary(newModelsDictionary);
    }, [assetsFromBim.models]);

    const getSectionHeaderText = () => {
        if (uploadState === BIMUploadState.PreProcessing) {
            return 'Specify files to upload from';
        }
        if (uploadState === BIMUploadState.PreUpload) {
            return 'Select models for upload';
        }
        if (
            uploadState === BIMUploadState.InUpload ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return 'Generate environment';
        }
    };

    const getSectionSubheaderText = () => {
        if (uploadState === BIMUploadState.PreProcessing) {
            return 'The specified BIM file and associated metadata will be used to extract models, twins, and relationships for upload to your ADT environment';
        }
        if (uploadState === BIMUploadState.PreUpload) {
            return 'All checked models and their associated twins and relationships will be inluded in the next step: uploading to your ADT environment';
        }
        if (
            uploadState === BIMUploadState.InUpload ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return 'The Models, twins, and relationships (filtered by the models selected in the previous step) will be pushed to your ADT environment';
        }
    };

    const setFilesFromInput = () => {
        setBimFilePath(bimFileInputRef?.current?.value);
        setMetadataFilePath(metadataFileInputRef?.current?.value);
    };

    const initiateEnvironmentCreation = () => {
        setGenerateEnvironmentStatus(UploadPhase.Uploading);
    };

    const onBackClick = () => {
        if (uploadState === BIMUploadState.PreUpload) {
            setUploadState(BIMUploadState.PreProcessing);
            setBimFilePath(null);
            setMetadataFilePath(null);
            setModelsDictionary(null);
        }
        if (uploadState === BIMUploadState.InUpload) {
            setUploadState(BIMUploadState.PreUpload);
        }
    };

    const onNextClick = () => {
        if (uploadState === BIMUploadState.PreProcessing) {
            setUploadState(BIMUploadState.PreUpload);
            setFilesFromInput();
        }
        if (uploadState === BIMUploadState.PreUpload) {
            setUploadState(BIMUploadState.InUpload);
        }
    };

    const isNextDisabled = () => {
        if (
            uploadState === BIMUploadState.InUpload ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return true;
        }
        if (
            uploadState === BIMUploadState.PreUpload &&
            (!modelsDictionary || Object.keys(modelsDictionary).length === 0)
        ) {
            return true;
        }
        return false;
    };

    const isBackDisabled = () => {
        if (
            uploadState === BIMUploadState.PreProcessing ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return true;
        }
        if (
            uploadState === BIMUploadState.InUpload &&
            generateEnvironmentStatus === UploadPhase.Uploading
        ) {
            return true;
        }
        return false;
    };

    const onGenerateADTAssetsComplete = () => {
        setUploadState(BIMUploadState.PostUpload);
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
                <div className="cb-section-subheader">
                    {getSectionSubheaderText()}
                </div>
                <div className="cb-section-content">
                    {uploadState === BIMUploadState.PreProcessing && (
                        <BIMFileSelection
                            bimInputRef={bimFileInputRef}
                            metadataInputRef={metadataFileInputRef}
                        />
                    )}
                    {uploadState === BIMUploadState.PreUpload && (
                        <ModelSelection
                            modelsDictionary={modelsDictionary}
                            setModelsDictionary={setModelsDictionary}
                            isParsingBIM={isParsingBIM}
                        />
                    )}
                    {(uploadState === BIMUploadState.InUpload ||
                        uploadState === BIMUploadState.PostUpload) && (
                        <>
                            {generateEnvironmentStatus ===
                                UploadPhase.PreUpload && (
                                <PrimaryButton
                                    onClick={initiateEnvironmentCreation}
                                    className="cb-initiate-upload-button"
                                >
                                    Initiate upload
                                </PrimaryButton>
                            )}
                            {generateEnvironmentStatus ===
                                UploadPhase.Uploading && (
                                <GenerateADTAssets
                                    adapter={adapter}
                                    models={assetsFromBim.models}
                                    twins={assetsFromBim.twins}
                                    relationships={assetsFromBim.relationships}
                                    triggerUpload={true}
                                    onComplete={onGenerateADTAssetsComplete}
                                />
                            )}
                        </>
                    )}
                    {uploadState === BIMUploadState.PostUpload && (
                        <PostUpload />
                    )}
                </div>
                <div className="cb-navigation-buttons">
                    <PrimaryButton
                        onClick={onNextClick}
                        className={'cb-navigation-button cb-next-button'}
                        disabled={isNextDisabled()}
                    >
                        Next
                    </PrimaryButton>
                    <DefaultButton
                        onClick={onBackClick}
                        disabled={isBackDisabled()}
                        className={'cb-navigation-button cb-back-button'}
                    >
                        Back
                    </DefaultButton>
                </div>
            </div>
        </BaseCard>
    );
};

const BIMFileSelection = ({ bimInputRef, metadataInputRef }) => {
    return (
        <div className="cb-bim-file-selection-container cb-bim-file-selection">
            <label className="cb-bim-input-label">BIM file path</label>
            <input
                ref={bimInputRef}
                className="cb-bim-input"
                defaultValue="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplex.xkt" //Will remove post code review, just here so people can test
            ></input>
            <label className="cb-bim-input-label">BIM Metadata path</label>
            <input
                ref={metadataInputRef}
                className="cb-bim-input"
                defaultValue="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json" //Will remove post code review, just here so people can test
            ></input>
        </div>
    );
};

const ModelSelection = ({
    modelsDictionary,
    setModelsDictionary,
    isParsingBIM
}) => {
    const flipModelSelected = (model) => {
        const updatedModelsDictionary = { ...modelsDictionary };
        updatedModelsDictionary[model] = !modelsDictionary[model];
        setModelsDictionary(updatedModelsDictionary);
    };

    const getSelectedCount = () => {
        let selectedCount = 0;

        Object.values(modelsDictionary).forEach((modelSelected) => {
            if (modelSelected) {
                selectedCount++;
            }
        });
        return selectedCount;
    };

    return (
        <div className="cb-model-selection-container">
            {isParsingBIM && (
                <div className="cb-loading-models-container">
                    <h3 className="cb-loading-models-text">
                        Parsing models...
                    </h3>
                    <Spinner />
                </div>
            )}
            {!isParsingBIM &&
                !!modelsDictionary &&
                Object.keys(modelsDictionary).length === 0 && (
                    <MessageBar
                        className={'cb-no-models-error'}
                        messageBarType={MessageBarType.error}
                    >
                        No models parsed
                    </MessageBar>
                )}
            {!isParsingBIM &&
                !!modelsDictionary &&
                Object.keys(modelsDictionary).length !== 0 && (
                    <>
                        <div className="cb-selected-count">
                            Models selected ({getSelectedCount()})
                        </div>
                        <div className="cb-checkbox-container">
                            {Object.keys(modelsDictionary).map(
                                (model, modelI) => (
                                    <Checkbox
                                        label={model}
                                        className="cb-model-checkbox"
                                        checked={modelsDictionary[model]}
                                        onChange={() =>
                                            flipModelSelected(model)
                                        }
                                        key={modelI}
                                    ></Checkbox>
                                )
                            )}
                        </div>
                    </>
                )}
        </div>
    );
};

const PostUpload = () => {
    return (
        <div className="cb-post-upload">
            <DefaultButton
                target="_blank"
                href="https://explorer.digitaltwins.azure.net/"
            >
                Go to environment
            </DefaultButton>
        </div>
    );
};

export default React.memo(BIMUploadCard);
