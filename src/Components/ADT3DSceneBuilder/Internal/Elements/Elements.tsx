import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
    DefaultButton,
    IContextualMenuItem,
    PrimaryButton,
    useTheme
} from '@fluentui/react';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { IADT3DSceneBuilderElementsProps } from '../../ADT3DSceneBuilder.types';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../CardboardList/CardboardList';
import { getLeftPanelStyles } from '../Shared/LeftPanel.styles';
import SearchHeader from '../Shared/SearchHeader';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import {
    I3DScenesConfig,
    IScene,
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CustomMeshItem } from '../../../../Models/Classes/SceneView.types';
import { createCustomMeshItems } from '../../../3DV/SceneView.Utils';
import PanelFooter from '../Shared/PanelFooter';
import { IADTObjectColor } from '../../../../Models/Constants';
import { deepCopy } from '../../../../Models/Services/Utils';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import noResults from '../../../../Resources/Static/noResults.svg';
import noElements from '../../../../Resources/Static/noElements.svg';

const sortElements = (elements: ITwinToObjectMapping[]) => {
    return elements?.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
};

const sortAndGroupElements = (
    elements: ITwinToObjectMapping[],
    selectedElements: ITwinToObjectMapping[]
) => {
    const sortedSelectedElements = sortElements(selectedElements);

    const sortedElements = sortElements(elements);

    // put selected items first
    const nonSelectedElements = sortedElements?.filter(
        (element) => !sortedSelectedElements?.find((x) => x.id === element.id)
    );

    return sortedSelectedElements?.concat(nonSelectedElements);
};

const SceneElements: React.FC<IADT3DSceneBuilderElementsProps> = ({
    elements,
    selectedElements,
    onCreateElementClick,
    onRemoveElement,
    onElementClick,
    updateSelectedElements,
    clearSelectedElements,
    onCreateBehaviorClick,
    isEditBehavior,
    hideSearch
}) => {
    const { t } = useTranslation();
    const [isConfirmDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [
        elementToDelete,
        setElementToDelete
    ] = useState<ITwinToObjectMapping>(undefined);
    const {
        adapter,
        config,
        sceneId,
        setOutlinedMeshItems,
        objectColor
    } = useContext(SceneBuilderContext);

    const [isSelectionEnabled, setIsSelectionEnabled] = useState(
        isEditBehavior || false
    );

    const elementsSorted = useRef(false);
    const lastSearch = useRef('');

    const [filteredElements, setFilteredElements] = useState<
        ITwinToObjectMapping[]
    >([]);
    const [listItems, setListItems] = useState<
        ICardboardListItem<ITwinToObjectMapping>[]
    >([]);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = deepCopy(
                config.configuration.scenes[
                    config.configuration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            );
            sceneToUpdate.elements = params.elements;
            return adapter.putScenesConfig(
                ViewerConfigUtility.editScene(config, sceneId, sceneToUpdate)
            );
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleDeleteElement = async () => {
        const newElements = [...elements];
        newElements.splice(
            elements.findIndex((e) => e.id === elementToDelete.id),
            1
        );
        await updateTwinToObjectMappings.callAdapter({
            elements: newElements
        });
        onRemoveElement(newElements);
    };

    useEffect(() => {
        let outlinedMeshes = [];
        if (selectedElements) {
            for (const selectedElement of selectedElements) {
                outlinedMeshes = outlinedMeshes.concat(
                    createCustomMeshItems(
                        selectedElement.objectIDs,
                        objectColor.outlinedMeshSelectedColor
                    )
                );
            }

            setOutlinedMeshItems(outlinedMeshes);
        }
    }, [selectedElements]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            setElementToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    // sort the list items
    useEffect(() => {
        if (elements) {
            const elementsCopy: ITwinToObjectMapping[] = deepCopy(elements);
            const sortedElements = sortElements(elementsCopy);
            setFilteredElements(sortedElements);
        }
    }, [elements]);

    // sort the list items and put the selected items first in the list
    useEffect(() => {
        if (
            elements &&
            selectedElements?.length > 0 &&
            !elementsSorted.current
        ) {
            const selectedElementsCopy: ITwinToObjectMapping[] = deepCopy(
                selectedElements
            );
            const elementsCopy: ITwinToObjectMapping[] = deepCopy(elements);
            const sortedElements = sortAndGroupElements(
                elementsCopy,
                selectedElementsCopy
            );
            setFilteredElements(sortedElements);

            elementsSorted.current = true;
        }
    }, [selectedElements]);

    // apply filtering
    useEffect(() => {
        if (lastSearch.current != searchText) {
            lastSearch.current = searchText;
            const filtered = elements
                ? deepCopy(
                      elements?.filter((element) =>
                          element.displayName
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                      )
                  )
                : [];
            const filteredSelected = selectedElements
                ? deepCopy(
                      selectedElements?.filter((element) =>
                          element.displayName
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                      )
                  )
                : [];

            const sortedFilteredElements = sortAndGroupElements(
                filtered,
                filteredSelected
            );
            setFilteredElements(sortedFilteredElements);
        }
    }, [searchText, elements, selectedElements]);

    const onUpdateCheckbox = useCallback(
        (element: ITwinToObjectMapping) => {
            const shouldCheck = !selectedElements?.find(
                (x) => x.id === element.id
            );
            updateSelectedElements(element, shouldCheck);
            elementsSorted.current = true;
        },
        [selectedElements, updateSelectedElements, elementsSorted.current]
    );

    const onMultiSelectChanged = useCallback(() => {
        clearSelectedElements();
        setIsSelectionEnabled(!isSelectionEnabled);
    }, [isSelectionEnabled]);

    // generate the list of items to show
    useEffect(() => {
        const elementsList = getListItems(
            config,
            filteredElements,
            isEditBehavior,
            isSelectionEnabled,
            onElementClick,
            onUpdateCheckbox,
            selectedElements,
            setElementToDelete,
            setIsDeleteDialogOpen,
            setOutlinedMeshItems,
            objectColor,
            t
        );
        setListItems(elementsList);
    }, [
        config,
        filteredElements,
        isEditBehavior,
        isSelectionEnabled,
        onElementClick,
        onUpdateCheckbox,
        selectedElements,
        setElementToDelete,
        setIsDeleteDialogOpen,
        setOutlinedMeshItems,
        objectColor
    ]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    return (
        <div className="cb-scene-builder-pivot-contents">
            {isEditBehavior && (
                <div className="cb-scene-builder-elements-title">
                    {t('3dSceneBuilder.elementsListInstructions')}
                </div>
            )}
            {!hideSearch && (
                <SearchHeader
                    isSelectionEnabled={isSelectionEnabled}
                    onMultiSelectClicked={
                        !isEditBehavior && onMultiSelectChanged
                    }
                    onSearchTextChange={setSearchText}
                    placeholder={t('3dSceneBuilder.searchElementsPlaceholder')}
                    searchText={searchText}
                />
            )}
            <div className={commonPanelStyles.content}>
                {elements.length === 0 ? (
                    <IllustrationMessage
                        headerText={t('3dSceneBuilder.noElementsText')}
                        type={'info'}
                        width={'compact'}
                        imageProps={{
                            src: noElements,
                            height: 100
                        }}
                    />
                ) : filteredElements.length === 0 ? (
                    <IllustrationMessage
                        headerText={t('3dSceneBuilder.noResults')}
                        type={'info'}
                        width={'compact'}
                        imageProps={{
                            src: noResults,
                            height: 100
                        }}
                    />
                ) : (
                    <CardboardList<ITwinToObjectMapping>
                        items={listItems}
                        listKey={`elements-in-scene`}
                        textToHighlight={searchText}
                    />
                )}
            </div>
            {!isEditBehavior && (
                <PanelFooter>
                    {isSelectionEnabled ? (
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
                                    setIsSelectionEnabled(false);
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
                </PanelFooter>
            )}
            <ConfirmDeleteDialog
                isOpen={isConfirmDeleteDialogOpen}
                onClose={() => {
                    setElementToDelete(null);
                    setIsDeleteDialogOpen(false);
                }}
                onConfirmDeletion={handleDeleteElement}
            />
        </div>
    );
};

function getListItems(
    config: I3DScenesConfig,
    filteredElements: ITwinToObjectMapping[],
    isEditBehavior: boolean,
    isSelectionEnabled: boolean,
    onElementClick: (element: ITwinToObjectMapping) => void,
    onUpdateCheckbox: (element: ITwinToObjectMapping) => void,
    selectedElements: ITwinToObjectMapping[],
    setElementToDelete: React.Dispatch<
        React.SetStateAction<ITwinToObjectMapping>
    >,
    setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setOutlinedMeshItems: (ids: Array<CustomMeshItem>) => void,
    objectColor: IADTObjectColor,
    t: TFunction<string>
): ICardboardListItem<ITwinToObjectMapping>[] {
    const onListItemClick = (element: ITwinToObjectMapping) => {
        if (isSelectionEnabled) {
            onUpdateCheckbox(element);
        } else {
            onElementClick(element);
        }
    };
    const getOverflowMenuItems = (
        element: ITwinToObjectMapping
    ): IContextualMenuItem[] => {
        return [
            {
                key: 'modify',
                'data-testid': 'modify-element',
                iconProps: {
                    iconName: 'Edit'
                },
                text: t('3dSceneBuilder.modifyElement'),
                onClick: () => onElementClick(element)
            },
            {
                key: 'delete',
                'data-testid': 'delete-element',
                iconProps: {
                    iconName: 'blocked2'
                },
                text: t('3dSceneBuilder.removeElement'),
                onClick: () => {
                    setElementToDelete(element);
                    setIsDeleteDialogOpen(true);
                }
            }
        ];
    };

    const onElementEnter = (element: ITwinToObjectMapping) => {
        let highlightedElements: CustomMeshItem[] = [];
        if (selectedElements?.length > 0) {
            for (const selectedElement of selectedElements) {
                // highlight hovered element if currently selected
                if (selectedElement.id === element.id) {
                    highlightedElements = highlightedElements.concat(
                        createCustomMeshItems(
                            selectedElement.objectIDs,
                            objectColor.outlinedMeshHoverSelectedColor
                        )
                    );
                } else {
                    // highlight other selected elements
                    highlightedElements = highlightedElements.concat(
                        createCustomMeshItems(
                            selectedElement.objectIDs,
                            objectColor.outlinedMeshSelectedColor
                        )
                    );
                }
            }

            // highlight if not selected but hovered
            if (!selectedElements.find((se) => se.id === element.id)) {
                highlightedElements = highlightedElements.concat(
                    createCustomMeshItems(
                        element?.objectIDs,
                        objectColor.outlinedMeshHoverColor
                    )
                );
            }
            setOutlinedMeshItems(highlightedElements);
        } else {
            setOutlinedMeshItems(
                createCustomMeshItems(
                    element?.objectIDs,
                    objectColor.outlinedMeshHoverColor
                )
            );
        }
    };

    const onElementLeave = () => {
        if (selectedElements?.length > 0) {
            let meshIds: string[] = [];
            for (const element of selectedElements) {
                if (element.objectIDs) {
                    meshIds = meshIds.concat(element?.objectIDs);
                }
            }
            setOutlinedMeshItems(
                createCustomMeshItems(
                    meshIds,
                    objectColor.outlinedMeshSelectedColor
                )
            );
        } else {
            setOutlinedMeshItems([]);
        }
    };

    return filteredElements.map((item) => {
        const isItemSelected = isSelectionEnabled
            ? !!selectedElements?.find((x) => x.id === item.id)
            : undefined;
        const viewModel: ICardboardListItem<ITwinToObjectMapping> = {
            ariaLabel: '',
            buttonProps: {
                onMouseEnter: () => onElementEnter(item),
                onMouseLeave: onElementLeave,
                onFocus: () => onElementEnter(item),
                onBlur: onElementLeave
            },
            iconStart: !isEditBehavior ? { name: 'Shapes' } : undefined,
            item: item,
            onClick: onListItemClick,
            overflowMenuItems: getOverflowMenuItems(item),
            textPrimary: item.displayName,
            textSecondary: isEditBehavior
                ? undefined
                : t('3dSceneBuilder.elementMetaText', {
                      numBehaviors: ViewerConfigUtility.getElementMetaData(
                          item,
                          config
                      )
                  }),
            isChecked: isItemSelected
        };

        return viewModel;
    });
}

export default SceneElements;
