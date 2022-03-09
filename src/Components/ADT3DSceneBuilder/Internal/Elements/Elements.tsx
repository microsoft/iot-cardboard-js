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
import {
    IScene,
    IScenesConfig,
    ITwinToObjectMapping
} from '../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { IADT3DSceneBuilderElementsProps } from '../../ADT3DSceneBuilder.types';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../CardboardList/CardboardList';
import { getLeftPanelStyles } from '../Shared/LeftPanel.styles';
import SearchHeader from '../Shared/SearchHeader';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import { ColoredMeshItem } from '../../../../Models/Classes/SceneView.types';
import { createColoredMeshItems } from '../../../3DV/SceneView.Utils';

const SceneElements: React.FC<IADT3DSceneBuilderElementsProps> = ({
    elements,
    selectedElements,
    onCreateElementClick,
    onRemoveElement,
    onElementClick,
    updateSelectedElements,
    clearSelectedElements,
    onCreateBehaviorClick,
    setColoredMeshItems,
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
    const { adapter, config, sceneId } = useContext(SceneBuilderContext);

    const [isSelectionEnabled, setIsSelectionEnabled] = useState(
        isEditBehavior || false
    );

    const elementsSorted = useRef(false);

    const [filteredElements, setFilteredElements] = useState<
        ITwinToObjectMapping[]
    >([]);
    const [listItems, setListItems] = useState<
        ICardboardListItem<ITwinToObjectMapping>[]
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
            setIsDeleteDialogOpen(false);
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    // sort the list items
    useEffect(() => {
        if (elements) {
            const elementsCopy: ITwinToObjectMapping[] = JSON.parse(
                JSON.stringify(elements)
            );
            const sortedElements = elementsCopy.sort((a, b) =>
                a.displayName > b.displayName ? 1 : -1
            );
            setFilteredElements(sortedElements);
        }
    }, [elements]);

    // put the selected items first in the list
    useEffect(() => {
        if (selectedElements?.length > 0 && !elementsSorted.current) {
            // sort the list
            elementsSorted.current = true;
            selectedElements?.sort((a, b) =>
                a.displayName > b.displayName ? 1 : -1
            );

            // put selected items first
            const nonSelectedElements = elements?.filter(
                (element) => !selectedElements.find((x) => x.id === element.id)
            );
            setFilteredElements(selectedElements.concat(nonSelectedElements));
        }
    }, [selectedElements]);

    // apply filtering
    useEffect(() => {
        const filtered = elements.filter((element) =>
            element.displayName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredElements(filtered);
    }, [searchText]);

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
            setColoredMeshItems,
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
        setColoredMeshItems
    ]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    return (
        <div className="cb-scene-builder-pivot-contents">
            {isEditBehavior && (
                <div className="cb-scene-builder-elements-title">
                    {t('3dSceneBuilder.selectBehaviorElements')}
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
            <div className={commonPanelStyles.rootListContainer}>
                {elements.length === 0 ? (
                    <p className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.noElementsText')}
                    </p>
                ) : filteredElements.length === 0 ? (
                    <p className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.noResults')}
                    </p>
                ) : (
                    <CardboardList<ITwinToObjectMapping>
                        items={listItems}
                        listKey={`elements-in-scene`}
                        textToHighlight={searchText}
                    />
                )}
            </div>
            {!isEditBehavior && (
                <div className="cb-scene-builder-footer-container">
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
                </div>
            )}
            <ConfirmDeleteDialog
                isOpen={isConfirmDeleteDialogOpen}
                onCancel={() => {
                    setElementToDelete(null);
                    setIsDeleteDialogOpen(false);
                }}
                onConfirmDeletion={handleDeleteElement}
                setIsOpen={setIsDeleteDialogOpen}
            />
        </div>
    );
};

function getListItems(
    config: IScenesConfig,
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
    setColoredMeshItems: (setColoredMeshItems: Array<ColoredMeshItem>) => void,
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
    return filteredElements.map((item) => {
        const isItemSelected = isSelectionEnabled
            ? !!selectedElements?.find((x) => x.id === item.id)
            : undefined;
        const viewModel: ICardboardListItem<ITwinToObjectMapping> = {
            ariaLabel: '',
            buttonProps: {
                onMouseOver: () =>
                    setColoredMeshItems(
                        createColoredMeshItems(item.meshIDs, null)
                    ),
                onMouseLeave: () => setColoredMeshItems([]),
                onFocus: () =>
                    setColoredMeshItems(
                        createColoredMeshItems(item.meshIDs, null)
                    ),
                onBlur: () => setColoredMeshItems([])
            },
            iconStartName: !isEditBehavior ? 'Shapes' : undefined,
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
