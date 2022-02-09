import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Checkbox,
    DefaultButton,
    FontIcon,
    IconButton,
    PrimaryButton,
    SearchBox,
    Separator
} from '@fluentui/react';
import {
    IScene,
    ITwinToObjectMapping
} from '../../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { IADT3DSceneBuilderElementsProps } from '../../ADT3DSceneBuilder.types';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';

const SceneElements: React.FC<IADT3DSceneBuilderElementsProps> = ({
    elements,
    selectedElements,
    onCreateElementClick,
    onRemoveElement,
    onElementClick,
    updateSelectedElements,
    clearSelectedElements,
    onCreateBehaviorClick,
    onElementEnter,
    onElementLeave,
    isEditBehavior
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

    const [toggleElementSelection, setToggleElementSelection] = useState(
        isEditBehavior
    );

    const [filteredElements, setFilteredElements] = useState<
        ITwinToObjectMapping[]
    >([]);

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
            return adapter.putScenesConfig(
                ViewerConfigUtility.editScene(config, sceneId, sceneToUpdate)
            );
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

    useEffect(() => {
        setFilteredElements(JSON.parse(JSON.stringify(elements)));
    }, [elements]);

    const searchElements = (searchTerm: string) => {
        const filtered = elements.filter((element) =>
            element.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredElements(filtered);
    };

    return (
        <div className="cb-scene-builder-pivot-contents">
            {isEditBehavior && (
                <div className="cb-scene-builder-elements-title">
                    {t('3dSceneBuilder.selectBehaviorElements')}
                </div>
            )}
            <div className="cb-scene-builder-element-search-header">
                <div className="cb-scene-builder-element-search-box">
                    <SearchBox
                        placeholder={t('3dSceneBuilder.searchElementsPlaceholder')}
                        onChange={(event, value) => searchElements(value)}
                    />
                </div>
                {!isEditBehavior && (
                    <IconButton
                        iconProps={{ iconName: 'MultiSelect' }}
                        title={t('3dSceneBuilder.toggleCheckboxes')}
                        styles={{
                            iconChecked: { color: '#ffffff' },
                            iconHovered: { color: '#ffffff' },
                            rootChecked: { background: '#0078d4' },
                            rootHovered: { background: '#0078d4' },
                            rootCheckedHovered: { background: '#0078d4' }
                        }}
                        ariaLabel={t('3dSceneBuilder.toggleCheckboxes')}
                        onClick={() => {
                            setToggleElementSelection(!toggleElementSelection);
                            clearSelectedElements();
                        }}
                        checked={toggleElementSelection}
                    />
                )}
            </div>
            <Separator
                styles={{
                    root: {
                        '&:before': {
                            backgroundColor:
                                'var(--fluent-color-grey-30)'
                        }
                    }
                }}
            />
            <div className="cb-scene-builder-element-list">
                {elements.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noElementsText')}
                    </p>
                ) : filteredElements.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noResults')}
                    </p>
                ) : (
                    filteredElements.map((element: ITwinToObjectMapping) => (
                        <div
                            className={`cb-scene-builder-left-panel-element ${elementToDelete?.id === element.id
                                ? 'cb-selected-element'
                                : ''
                                }`}
                            key={element.displayName}
                            onClick={() => {
                                if (!toggleElementSelection) {
                                    onElementClick(element);
                                }
                            }}
                            onMouseOver={() => onElementEnter(element)}
                            onMouseLeave={() => onElementLeave(element)}
                        >
                            <div className="cb-element-name-wrapper">
                                {toggleElementSelection && (
                                    <Checkbox
                                        className="cb-scene-builder-element-checkbox"
                                        onChange={(e, checked) => {
                                            updateSelectedElements(
                                                element,
                                                checked
                                            );
                                        }}
                                        defaultChecked={
                                            selectedElements?.find(
                                                (item) => item.id === element.id
                                            )
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                                <FontIcon
                                    iconName={'Shapes'}
                                    className="cb-element"
                                />
                                <span className="cb-scene-builder-element-name">
                                    {element.displayName}
                                </span>
                            </div>
                            {!toggleElementSelection && (
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
                            )}
                        </div>
                    ))
                )}
            </div>
            {!isEditBehavior && (
                <div>
                    {toggleElementSelection ? (
                        <div>
                            <PrimaryButton
                                className="cb-scene-builder-create-button"
                                text={t('3dSceneBuilder.createBehavior')}
                                onClick={onCreateBehaviorClick}
                                disabled={
                                    selectedElements &&
                                        selectedElements.length > 0
                                        ? false
                                        : true
                                }
                            />
                            <DefaultButton
                                text={t('3dSceneBuilder.cancel')}
                                onClick={() => {
                                    setToggleElementSelection(false);
                                    clearSelectedElements();
                                }}
                                className="cb-scene-builder-cancel-button"
                            />
                        </div>
                    ) : (
                        <PrimaryButton
                            className="cb-scene-builder-create-button"
                            onClick={onCreateElementClick}
                            text={t('3dSceneBuilder.newElement')}
                        />
                    )}
                </div>
            )}
            <ConfirmDeleteDialog
                isOpen={isConfirmDeleteDialogOpen}
                onCancel={() => {
                    setElementToDelete(null);
                    setIsConfirmDeleteDialogOpen(false);
                }}
                onConfirmDeletion={handleDeleteElement}
                setIsOpen={setIsConfirmDeleteDialogOpen}
            />
        </div>
    );
};

export default SceneElements;
