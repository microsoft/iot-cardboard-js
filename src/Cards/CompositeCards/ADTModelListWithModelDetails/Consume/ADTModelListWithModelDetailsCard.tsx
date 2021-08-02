import React, { useEffect, useRef, useState } from 'react';
import {
    DTModel,
    IADTModel,
    IHierarchyNode
} from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { ADTModelListWithModelDetailsCardProps } from './ADTModelListWithModelDetailsCard.types';
import ADTModelListCard from '../../../ADTModelListCard/Consume/ADTModelListCard';
import ModelCreate from '../../../../Components/ModelCreate/ModelCreate';
import { DTDLModel } from '../../../../Models/Classes/DTDL';
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
import JsonPreview from '../../../../Components/JsonPreview/JsonPreview';
import { downloadText } from '../../../../Models/Services/Utils';
import { FormMode } from '../../../../Models/Constants/Enums';
import './ADTModelListWithModelDetailsCard.scss';
import {
    AdapterResult,
    ADTAdapterModelsData
} from '../../../../Models/Classes';

const ADTModelListWithModelDetailsCard: React.FC<ADTModelListWithModelDetailsCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );
    const [errorMessage, setErrorMessage] = useState(null);
    const selectedModelRef = useRef(selectedModel);
    const existingModelIdsRef = useRef([]);
    const modelListComponentRef = useRef();
    const modelCreateComponentRef = useRef();

    const handleModelClick = (modelNode: IHierarchyNode) => {
        setSelectedModel(DTDLModel.fromObject(modelNode.nodeData.model));
    };

    const handleNewModelClick = () => {
        setSelectedModel(null);
    };

    const handleCreateModelClick = async (model: DTDLModel) => {
        const resolvedModels: AdapterResult<ADTAdapterModelsData> = await adapter.createADTModels(
            [model.trimmedCopy() as DTModel]
        );
        if (resolvedModels.getCatastrophicError()?.rawError) {
            setErrorMessage(
                (resolvedModels.getCatastrophicError().rawError as any).response
                    ?.data?.error?.message
            );
        } else {
            const resolvedModel = resolvedModels.getData()?.[0] as IADTModel;
            if (resolvedModel) {
                (modelListComponentRef.current as any)?.addNewModel({
                    ...resolvedModel,
                    model: model as DTModel
                });
                setSelectedModel(model);
            }
        }
    };

    const onDowloadClick = () => {
        downloadText(
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
                <div className="cb-mbcard-list">
                    <ADTModelListCard
                        theme={theme}
                        locale={locale}
                        adapter={adapter}
                        onModelClick={handleModelClick}
                        onNewModelClick={handleNewModelClick}
                        selectedModelId={selectedModel?.['@id']}
                        ref={modelListComponentRef}
                    />
                </div>
                {selectedModel !== undefined && (
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
                            onPrimaryAction={handleCreateModelClick}
                            formControlMode={
                                selectedModel ? FormMode.Readonly : FormMode.New
                            }
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

export default React.memo(ADTModelListWithModelDetailsCard);
