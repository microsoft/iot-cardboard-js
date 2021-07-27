import React, { useEffect, useRef, useState } from 'react';
import {
    DTModel,
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
    const selectedModelRef = useRef(selectedModel);
    const modelListComponentRef = useRef();
    const modelCreateComponentRef = useRef();

    const handleModelClick = (modelNode: IHierarchyNode) => {
        setSelectedModel(DTDLModel.fromObject(modelNode.nodeData.model));
    };

    const handleNewModelClick = () => {
        setSelectedModel(null);
    };

    const handleCreateModelClick = async (model: DTDLModel) => {
        model.removeEmptyProperties();
        const resolvedModels: AdapterResult<ADTAdapterModelsData> = await adapter.createADTModels(
            [model as DTModel]
        );
        const resolvedModel = resolvedModels.getData()?.[0];
        if (resolvedModel) {
            (modelListComponentRef.current as any)?.addNewModel(resolvedModel);
            setSelectedModel(model);
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
            `${selectedModelRef.current?.displayName}.json`
        );
    };

    useEffect(() => {
        selectedModelRef.current = selectedModel;
    }, [selectedModel]);

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

    const mockExistingModels = [
        'dtmi;com:example:www:door1;1',
        'dtmi;com:example:www:roof1;1',
        'dtmi;com:example:www:room1;1'
    ];

    const confirmDeletionDialogProps = {
        type: DialogType.normal,
        title: t('confirmDeletion'),
        closeButtonAriaLabel: t('close'),
        subText: t('confirmDeletionDesc')
    };

    const confirmDeletionDialogStyles = { main: { maxWidth: 450 } };
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
                            existingModelIds={mockExistingModels}
                            onCancel={() => setSelectedModel(undefined)}
                            onPrimaryAction={handleCreateModelClick}
                            formControlMode={
                                selectedModel ? FormMode.Readonly : FormMode.New
                            }
                            ref={modelCreateComponentRef}
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

export default React.memo(ADTModelListWithModelDetailsCard);
