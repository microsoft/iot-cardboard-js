import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    IconButton,
    PrimaryButton
} from '@fluentui/react';
import {
    IScene,
    ITwinToObjectMapping
} from '../../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import useAdapter from '../../../../../Models/Hooks/useAdapter';

const SceneElements: React.FC<any> = ({
    elements,
    onCreateElementClick,
    onRemoveElement,
    onElementClick,
    onElementEnter,
    onElementLeave
}) => {
    const { t } = useTranslation();
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );
    const [
        elementToDelete,
        setElementToDelete
    ] = useState<ITwinToObjectMapping>(undefined);
    const { adapter, config, sceneId } = useContext(SceneBuilderContext);

    const confirmDeletionDialogProps = {
        type: DialogType.normal,
        title: t('confirmDeletion'),
        closeButtonAriaLabel: t('close'),
        subText: t('confirmDeletionDesc')
    };
    const confirmDeletionDialogStyles = {
        main: {
            maxWidth: 450,
            minHeight: 165
        }
    };
    const confirmDeletionModalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: confirmDeletionDialogStyles,
            className: 'cb-scene-builder-element-list-dialog-wrapper'
        }),
        []
    );

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = {
                ...config.viewerConfiguration.scenes[
                    config.viewerConfiguration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            };
            sceneToUpdate.twinToObjectMappings = params.elements;
            return adapter.editScene(config, sceneId, sceneToUpdate);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleDeleteElement = () => {
        const newElements = [...elements];
        newElements.splice(
            elements.findIndex((e) => e.id === elementToDelete.id),
            1
        );
        updateTwinToObjectMappings.callAdapter({
            elements: newElements
        });
        onRemoveElement(newElements);
    };

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            setElementToDelete(null);
            setIsConfirmDeleteDialogOpen(false);
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-element-list">
                {elements.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noElementsText')}
                    </p>
                ) : (
                    elements.map((element: ITwinToObjectMapping) => (
                        <div
                            className={`cb-scene-builder-left-panel-element ${
                                elementToDelete?.id === element.id
                                    ? 'cb-selected-element'
                                    : ''
                            }`}
                            key={element.displayName}
                            onClick={() => onElementClick(element)}
                            onMouseEnter={() => onElementEnter(element)}
                            onMouseLeave={onElementLeave}
                        >
                            <div className="cb-element-name-wrapper">
                                <FontIcon
                                    iconName={'Shapes'}
                                    className="cb-element"
                                />
                                <span className="cb-scene-builder-element-name">
                                    {element.displayName}
                                </span>
                            </div>
                            <IconButton
                                className="cb-remove-object-button"
                                iconProps={{
                                    iconName: 'Delete'
                                }}
                                title={t('remove')}
                                ariaLabel={t('remove')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setElementToDelete(element);
                                    setIsConfirmDeleteDialogOpen(true);
                                }}
                            />
                        </div>
                    ))
                )}
            </div>
            <PrimaryButton
                className="cb-scene-builder-create-button"
                onClick={onCreateElementClick}
                text={t('3dSceneBuilder.newElement')}
            />
            <Dialog
                hidden={!isConfirmDeleteDialogOpen}
                onDismiss={() => {
                    setElementToDelete(null);
                    setIsConfirmDeleteDialogOpen(false);
                }}
                dialogContentProps={confirmDeletionDialogProps}
                modalProps={confirmDeletionModalProps}
            >
                <DialogFooter>
                    <DefaultButton
                        onClick={() => {
                            setElementToDelete(null);
                            setIsConfirmDeleteDialogOpen(false);
                        }}
                        text={t('cancel')}
                    />
                    <PrimaryButton
                        onClick={handleDeleteElement}
                        text={t('delete')}
                    />
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default SceneElements;
