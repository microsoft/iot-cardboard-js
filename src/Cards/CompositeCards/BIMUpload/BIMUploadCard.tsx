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
    FontIcon,
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
            return t('BIMUpload.specifyFiles');
        }
        if (uploadState === BIMUploadState.PreUpload) {
            return t('BIMUpload.selectModels');
        }
        if (
            uploadState === BIMUploadState.InUpload ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return t('BIMUpload.generateEnvironment');
        }
    };

    const getSectionSubheaderText = () => {
        if (uploadState === BIMUploadState.PreProcessing) {
            return t('BIMUpload.specifyFilesSubheader');
        }
        if (uploadState === BIMUploadState.PreUpload) {
            return t('BIMUpload.selectModelsSubheader');
        }
        if (
            uploadState === BIMUploadState.InUpload ||
            uploadState === BIMUploadState.PostUpload
        ) {
            return t('BIMUpload.generateEnvironmentSubheader');
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
            <div className="cb-bim-upload-container">
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
                                t={t}
                                defaultBIMPath={bimFilePath}
                                defaultMetadataPath={metadataFilePath}
                            />
                        )}
                        {uploadState === BIMUploadState.PreUpload && (
                            <ModelSelection
                                modelsDictionary={modelsDictionary}
                                setModelsDictionary={setModelsDictionary}
                                isParsingBIM={isParsingBIM}
                                t={t}
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
                                        {t('BIMUpload.initiateUpload')}
                                    </PrimaryButton>
                                )}
                                {generateEnvironmentStatus ===
                                    UploadPhase.Uploading && (
                                    <GenerateADTAssets
                                        adapter={adapter}
                                        models={assetsFromBim.models}
                                        twins={assetsFromBim.twins}
                                        relationships={
                                            assetsFromBim.relationships
                                        }
                                        triggerUpload={true}
                                        onComplete={onGenerateADTAssetsComplete}
                                    />
                                )}
                            </>
                        )}
                        {uploadState === BIMUploadState.PostUpload && (
                            <PostUpload
                                t={t}
                                environmentId={adapter.getAdtHostUrl()}
                            />
                        )}
                    </div>
                    <div className="cb-navigation-buttons">
                        <PrimaryButton
                            onClick={onNextClick}
                            className={'cb-navigation-button cb-next-button'}
                            disabled={isNextDisabled()}
                        >
                            {t('next')}
                        </PrimaryButton>
                        <DefaultButton
                            onClick={onBackClick}
                            disabled={isBackDisabled()}
                            className={'cb-navigation-button cb-back-button'}
                        >
                            {t('back')}
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </BaseCard>
    );
};

const BIMFileSelection = ({
    bimInputRef,
    metadataInputRef,
    t,
    defaultBIMPath,
    defaultMetadataPath
}) => {
    return (
        <div className="cb-bim-file-selection-container cb-bim-file-selection">
            <label className="cb-bim-input-label">
                {t('BIMUpload.bimFilePath')}
            </label>
            <input
                ref={bimInputRef}
                className="cb-bim-input"
                defaultValue={defaultBIMPath ? defaultBIMPath : ''}
            ></input>
            <label className="cb-bim-input-label">
                {t('BIMUpload.metadataFilePath')}
            </label>
            <input
                ref={metadataInputRef}
                className="cb-bim-input"
                defaultValue={defaultMetadataPath ? defaultMetadataPath : ''}
            ></input>
        </div>
    );
};

const ModelSelection = ({
    modelsDictionary,
    setModelsDictionary,
    isParsingBIM,
    t
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
                        {t('BIMUpload.parsingModels')}
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
                        {t('BIMUpload.noModelsParsed')}
                    </MessageBar>
                )}
            {!isParsingBIM &&
                !!modelsDictionary &&
                Object.keys(modelsDictionary).length !== 0 && (
                    <>
                        <div className="cb-selected-count">
                            {t('BIMUpload.modelsSelectedCount', {
                                count: getSelectedCount()
                            })}
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

const PostUpload = ({ t, environmentId }) => {
    return (
        <div className="cb-post-upload">
            <PrimaryButton
                href={`http://explorer.digitaltwins.azure.net/?eid=${environmentId}`}
                target="_blank"
            >
                {t('BIMUpload.goToEnvironment')}
                <FontIcon
                    iconName="NavigateExternalInline"
                    className="cb-navigate-icon"
                ></FontIcon>
            </PrimaryButton>
        </div>
    );
};

export default React.memo(BIMUploadCard);
