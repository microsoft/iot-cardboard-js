import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Checkbox,
    DefaultButton,
    FontIcon,
    IconButton,
    PrimaryButton,
    SearchBox
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
    isEditBehavior,
    hideSearch
}) => {
    const { t } = useTranslation();
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(
        false
    );
    const [
        elementToDelete,
        setElementToDelete
    ] = useState<ITwinToObjectMapping>(undefined);
    const [hoveredElement, setHoveredElement] = useState<ITwinToObjectMapping>(
        undefined
    );
    const { adapter, config, sceneId } = useContext(SceneBuilderContext);

    const [toggleElementSelection, setToggleElementSelection] = useState(
        isEditBehavior
    );

    const elementsSorted = useRef(false);

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
        const sortedElements = elements?.sort((a, b) =>
            a.displayName > b.displayName ? 1 : -1
        );
        setFilteredElements(JSON.parse(JSON.stringify(sortedElements)));
    }, [elements]);

    useEffect(() => {
        if (selectedElements?.length > 0 && !elementsSorted.current) {
            elementsSorted.current = true;
            selectedElements?.sort((a, b) =>
                a.displayName > b.displayName ? 1 : -1
            );

            const nonSelectedElements = elements?.filter(
                (element) =>
                    !selectedElements.find(
                        (selectedElement) => selectedElement.id === element.id
                    )
            );
            setFilteredElements(selectedElements.concat(nonSelectedElements));
        }
    }, [selectedElements]);

    const searchElements = (searchTerm: string) => {
        const filtered = elements.filter((element) =>
            element.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredElements(filtered);
    };

    const updateCheckbox = (element: ITwinToObjectMapping) => {
        const shouldCheck = selectedElements?.find((selectedElement) => selectedElement.id === element.id) ? false : true;
        updateSelectedElements(
            element,
            shouldCheck
        );
        elementsSorted.current = true;
    }

    return (
        <>
            {isEditBehavior && (
                <div className="cb-scene-builder-elements-title">
                    {t('3dSceneBuilder.selectBehaviorElements')}
                </div>
            )}
            {!hideSearch && (
                <div>
                    <div className="cb-scene-builder-element-search-header">
                        <div className="cb-scene-builder-element-search-box">
                            <SearchBox
                                placeholder={t('3dSceneBuilder.searchElements')}
                                onChange={(event, value) =>
                                    searchElements(value)
                                }
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
                                    rootCheckedHovered: {
                                        background: '#0078d4'
                                    }
                                }}
                                ariaLabel={t('3dSceneBuilder.toggleCheckboxes')}
                                onClick={() => {
                                    setToggleElementSelection(
                                        !toggleElementSelection
                                    );
                                    clearSelectedElements();
                                }}
                                checked={toggleElementSelection}
                            />
                        )}
                    </div>
                    <div className="cb-scene-builder-element-spacer" />
                </div>
            )}
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
                            className={`cb-scene-builder-left-panel-element ${
                                hoveredElement?.id === element.id ||
                                elementToDelete?.id === element.id
                                    ? 'cb-selected-element'
                                    : ''
                            }`}
                            key={element.displayName}
                            onClick={() => {
                                if (!toggleElementSelection) {
                                    onElementClick(element);
                                } else {
                                    updateCheckbox(element);
                                }
                            }}
                            onMouseOver={() => onElementEnter(element)}
                            onMouseLeave={() => onElementLeave(element)}
                        >
                                {toggleElementSelection && (
                                    <Checkbox
                                        onChange={(e, checked) => {
                                            updateSelectedElements(
                                                element,
                                                !checked
                                            );
                                            elementsSorted.current = true;
                                        }}
                                        className="cb-scene-builder-element-checkbox"
                                        checked={
                                            selectedElements?.find(
                                                (item) => item.id === element.id
                                            )
                                                ? true
                                                : false
                                        }
                                    />
                                )}
                                <div>
                                    <FontIcon iconName={'Shapes'} className="cb-element-icon" />
                                </div>
                                <div className='cb-scene-builder-element-title'>
                                    <div className="cb-scene-builder-element-name">
                                        {element.displayName}
                                    </div>
                                    <div className='cb-scene-builder-element-item-meta'>
                                        {t('3dSceneBuilder.elementMetaText', {
                                            numBehaviors:
                                            ViewerConfigUtility.getElementMetaData(element, config)?.numBehaviors,
                                            numMeshes: ViewerConfigUtility.getElementMetaData(element, config)?.numMeshes
                                        })}
                                    </div>
                                </div>
                            {!toggleElementSelection && (
                                <IconButton
                                    className={`${
                                        hoveredElement?.id === element.id
                                            ? 'cb-scene-builder-element-actions-hovered'
                                            : 'cb-scene-builder-element-actions'
                                    }`}
                                    title={t('more')}
                                    ariaLabel={t('more')}
                                    menuIconProps={{
                                        iconName: 'MoreVertical',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            color: 'black'
                                        }
                                    }}
                                    onMenuClick={() => {
                                        setHoveredElement(element);
                                    }}
                                    menuProps={{
                                        onMenuDismissed: () => {
                                            setHoveredElement(null);
                                        },
                                        items: [
                                            {
                                                key: 'Modify',
                                                text: t(
                                                    '3dSceneBuilder.modifyElement'
                                                ),
                                                iconProps: {
                                                    iconName: 'edit'
                                                },
                                                onClick: () =>
                                                    onElementClick(element)
                                            },
                                            {
                                                key: 'delete',
                                                text: t(
                                                    '3dSceneBuilder.removeElement'
                                                ),
                                                iconProps: {
                                                    iconName: 'blocked2'
                                                },
                                                onClick: () => {
                                                    setElementToDelete(element);
                                                    setIsConfirmDeleteDialogOpen(
                                                        true
                                                    );
                                                }
                                            }
                                        ]
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
        </>
    );
};

export default SceneElements;
