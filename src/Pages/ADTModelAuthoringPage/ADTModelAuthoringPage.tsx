import React, { useEffect, useRef, useState } from 'react';
import { IADTModel, IHierarchyNode } from '../../Models/Constants/Interfaces';
import { ADTModelAuthoringPageProps } from './ADTModelAuthoringPage.types';
import ModelCreate from '../../Components/ModelCreate/ModelCreate';
import { DTDLModel } from '../../Models/Classes/DTDL';
import {
    CommandBar,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    ICommandBarItemProps,
    MessageBar,
    MessageBarType,
    PrimaryButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import JsonPreview from '../../Components/JsonPreview/JsonPreview';
import { downloadJSON } from '../../Models/Services/Utils';
import { FormMode } from '../../Models/Constants/Enums';
import './ADTModelAuthoringPage.scss';
import { BaseCompositeCard, ADTModelListCard } from '../..';
import ADTModelAuthoringCard from '../../Cards/CompositeCards/ADTModelAuthoring/ADTModelAuthoringCard';

const ADTModelAuthoringPage: React.FC<ADTModelAuthoringPageProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    onAuthoringOpen,
    onAuthoringClose
}) => {
    const { t } = useTranslation();
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [isModelAuthoringVisible, setIsModelAuthoringVisible] = useState(
        false
    );
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );
    const [errorMessage, setErrorMessage] = useState(null);
    const newlyAddedModels = useRef([]);
    const selectedModelRef = useRef(selectedModel);
    const existingModelIdsRef = useRef([]);
    const modelListComponentRef = useRef();
    const modelCreateComponentRef = useRef();

    const handleModelClick = (modelNode: IHierarchyNode) => {
        setSelectedModel(DTDLModel.fromObject(modelNode.nodeData.model));
    };

    const handleNewModelClick = () => {
        setSelectedModel(null);
        setIsModelAuthoringVisible(true);
        if (onAuthoringOpen && typeof onAuthoringOpen === 'function') {
            onAuthoringOpen();
        }
    };

    const handleModelAuthoringCancel = () => {
        setIsModelAuthoringVisible(false);
        if (onAuthoringClose && typeof onAuthoringClose === 'function') {
            onAuthoringClose();
        }
    };

    const handleModelAuthoringPublish = (models: Array<IADTModel>) => {
        newlyAddedModels.current = models.map((m) => m.id);
        setTimeout(() => {
            handleModelAuthoringCancel();
        }, 2000);
    };

    const onDowloadClick = () => {
        downloadJSON(
            JSON.stringify(
                selectedModelRef.current ||
                    (modelCreateComponentRef.current as any)?.getModel(),
                null,
                2
            ),
            `${
                selectedModelRef.current?.displayName ||
                selectedModelRef.current?.['@id'] ||
                (modelCreateComponentRef.current as any)?.getModel()
                    .displayName ||
                (modelCreateComponentRef.current as any)?.getModel()['@id'] ||
                t('modelCreate.newModel')
            }.json`
        );
    };

    useEffect(() => {
        selectedModelRef.current = selectedModel;
        existingModelIdsRef.current = (modelListComponentRef.current as any)?.getModelIds();
        setErrorMessage(null);
    }, [selectedModel]);

    useEffect(() => {
        // resetting state with adapter change
        setIsConfirmDeleteDialogOpen(false);
        setIsModelPreviewOpen(false);
        setErrorMessage(null);
        setSelectedModel(undefined);
    }, [adapter]);

    const commandItems: ICommandBarItemProps[] = React.useMemo(() => {
        const actions = [
            {
                key: 'newItem',
                text: `${t('view')} DTDL`,
                iconProps: { iconName: 'FileCode' },
                onClick: () => {
                    setIsModelPreviewOpen(true);
                }
            },
            {
                key: 'download',
                text: t('download'),
                iconProps: { iconName: 'Download' },
                onClick: onDowloadClick
            }
        ];
        if (selectedModelRef.current) {
            actions.push({
                key: 'deleteItem',
                text: t('delete'),
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    setIsConfirmDeleteDialogOpen(true);
                }
            });
        }
        return actions;
    }, [selectedModelRef.current]);

    const confirmDeletionDialogProps = {
        type: DialogType.normal,
        title: t('confirmDeletion'),
        closeButtonAriaLabel: t('close'),
        subText: t('confirmDeletionDesc')
    };

    const confirmDeletionDialogStyles = {
        main: { maxWidth: 450, minHeight: 165 }
    };
    const confirmDeletionModalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: confirmDeletionDialogStyles
        }),
        []
    );

    return (
        <div className="cb-mbcard-wrapper">
            <BaseCompositeCard
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
            >
                {!isModelAuthoringVisible && (
                    <div className="cb-mbcard-list">
                        <ADTModelListCard
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            onModelClick={handleModelClick}
                            onNewModelClick={handleNewModelClick}
                            selectedModelId={selectedModel?.['@id']}
                            ref={modelListComponentRef}
                            newlyAddedModelIds={newlyAddedModels.current}
                        />
                    </div>
                )}
                {selectedModel && (
                    <div className="cb-mbcard-form">
                        <CommandBar
                            className={'cb-commandbar'}
                            items={commandItems}
                            ariaLabel="Use left and right arrow keys to navigate between commands"
                        />
                        <ModelCreate
                            key={selectedModel?.['@id']}
                            locale={locale}
                            modelToEdit={selectedModel}
                            existingModelIds={existingModelIdsRef.current}
                            onCancel={() => setSelectedModel(undefined)}
                            isShowDTDLButtonVisible={false}
                            formControlMode={FormMode.Readonly}
                            ref={modelCreateComponentRef}
                        />
                        {errorMessage && (
                            <MessageBar
                                messageBarType={MessageBarType.error}
                                dismissButtonAriaLabel={t('close')}
                                onDismiss={() => setErrorMessage(null)}
                                className="cb-mbcard-error-message"
                            >
                                {errorMessage}
                            </MessageBar>
                        )}
                    </div>
                )}
                {isModelAuthoringVisible && (
                    <div className="cb-mbcard-authoring">
                        <ADTModelAuthoringCard
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            onCancel={handleModelAuthoringCancel}
                            onPublish={handleModelAuthoringPublish}
                        />
                    </div>
                )}
            </BaseCompositeCard>

            <JsonPreview
                json={
                    selectedModel ||
                    (modelCreateComponentRef.current as any)?.getModel()
                }
                isOpen={isModelPreviewOpen}
                onDismiss={() => setIsModelPreviewOpen(false)}
                modalTitle={selectedModel?.displayName}
            />

            <Dialog
                hidden={!isConfirmDeleteDialogOpen}
                onDismiss={() => setIsConfirmDeleteDialogOpen(false)}
                dialogContentProps={confirmDeletionDialogProps}
                modalProps={confirmDeletionModalProps}
            >
                <DialogFooter>
                    <PrimaryButton
                        onClick={() => {
                            adapter.deleteADTModel(
                                selectedModelRef.current['@id']
                            );
                            setIsConfirmDeleteDialogOpen(false);
                            setSelectedModel(undefined);
                            (modelListComponentRef.current as any)?.deleteModel(
                                selectedModelRef.current['@id']
                            );
                        }}
                        text={t('delete')}
                    />
                    <DefaultButton
                        onClick={() => setIsConfirmDeleteDialogOpen(false)}
                        text={t('cancel')}
                    />
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default React.memo(ADTModelAuthoringPage);
