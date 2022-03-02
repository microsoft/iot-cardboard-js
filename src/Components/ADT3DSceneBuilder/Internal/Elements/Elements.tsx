import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    IconButton,
    IContextualMenuItem,
    PrimaryButton,
    SearchBox,
    Separator
} from '@fluentui/react';
import {
    IScene,
    ITwinToObjectMapping
} from '../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { IADT3DSceneBuilderElementsProps } from '../../ADT3DSceneBuilder.types';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../CardboardList/CardboardList';
import { CardboardListItemProps } from '../../../CardboardList/CardboardListItem';

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
    const [searchText, setSearchText] = useState('');
    const [
        elementToDelete,
        setElementToDelete
    ] = useState<ITwinToObjectMapping>(undefined);
    const [hoveredElement, setHoveredElement] = useState<ITwinToObjectMapping>(
        undefined
    );
    const { adapter, config, sceneId } = useContext(SceneBuilderContext);

    const [isSelectionEnabled, setIsSelectionEnabled] = useState(
        isEditBehavior || false
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

    // apply filtering
    useEffect(() => {
        const filtered = elements.filter((element) =>
            element.displayName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredElements(filtered);
    }, [searchText]);

    const updateCheckbox = (element: ITwinToObjectMapping) => {
        const shouldCheck = !selectedElements?.find((x) => x.id === element.id);
        updateSelectedElements(element, shouldCheck);
        elementsSorted.current = true;
    };

    const onListItemClick = useCallback(
        (element: ITwinToObjectMapping) => {
            console.log(
                'clicked item and selection state is ',
                isSelectionEnabled
            );
            if (!isSelectionEnabled) {
                onElementClick(element);
            } else {
                updateCheckbox(element);
            }
        },
        [isSelectionEnabled]
    );
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
                    setIsConfirmDeleteDialogOpen(true);
                }
            }
        ];
    };
    const getListItemProps = (
        item: ITwinToObjectMapping
    ): CardboardListItemProps<ITwinToObjectMapping> => {
        const metadata = ViewerConfigUtility.getElementMetaData(item, config);
        return {
            ariaLabel: '',
            iconStartName: !isEditBehavior ? 'Shapes' : undefined,
            onClick: onListItemClick,
            overflowMenuItems: getOverflowMenuItems(item),
            textPrimary: item.displayName,
            textSecondary: t('3dSceneBuilder.elementMetaText', {
                numBehaviors: metadata
            }),
            isChecked: isSelectionEnabled
                ? !!selectedElements?.find((x) => x.id === item.id)
                : undefined
        };
    };

    return (
        <div className="cb-scene-builder-pivot-contents">
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
                                placeholder={t(
                                    '3dSceneBuilder.searchElementsPlaceholder'
                                )}
                                onChange={(_e, value) => setSearchText(value)}
                                value={searchText}
                            />
                        </div>
                        {!isEditBehavior && (
                            <IconButton
                                iconProps={{ iconName: 'MultiSelect' }}
                                title={t('3dSceneBuilder.multiSelectElements')}
                                styles={{
                                    iconChecked: { color: '#ffffff' },
                                    iconHovered: { color: '#ffffff' },
                                    rootChecked: { background: '#0078d4' },
                                    rootHovered: { background: '#0078d4' },
                                    rootCheckedHovered: {
                                        background: '#0078d4'
                                    }
                                }}
                                ariaLabel={t(
                                    '3dSceneBuilder.multiSelectElements'
                                )}
                                onClick={() => {
                                    console.log(
                                        'changing toggle state',
                                        isSelectionEnabled
                                    );
                                    clearSelectedElements();
                                    setIsSelectionEnabled(!isSelectionEnabled);
                                }}
                                checked={isSelectionEnabled}
                            />
                        )}
                    </div>
                    <Separator />
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
                    <CardboardList<ITwinToObjectMapping>
                        items={filteredElements}
                        getListItemProps={getListItemProps}
                        // need to do this hack to force rendering when state changes
                        listKey={`elements-in-scene`}
                        textToHighlight={searchText}
                    />
                    // filteredElements.map(
                    //     (element: ITwinToObjectMapping, index) => (
                    //         <div
                    //             className={`cb-scene-builder-left-panel-element ${
                    //                 hoveredElement?.id === element.id ||
                    //                 elementToDelete?.id === element.id
                    //                     ? 'cb-selected-element'
                    //                     : ''
                    //             }${isEditBehavior ? 'cb-element-center' : ''}`}
                    //             key={element.displayName}
                    //             onClick={() => {
                    //                 if (!toggleElementSelection) {
                    //                     onElementClick(element);
                    //                 } else {
                    //                     updateCheckbox(element);
                    //                 }
                    //             }}
                    //             onMouseOver={() => onElementEnter(element)}
                    //             onMouseLeave={() => onElementLeave(element)}
                    //         >
                    //             {toggleElementSelection && (
                    //                 <Checkbox
                    //                     onChange={(e, checked) => {
                    //                         updateSelectedElements(
                    //                             element,
                    //                             !checked
                    //                         );
                    //                         elementsSorted.current = true;
                    //                     }}
                    //                     className="cb-scene-builder-element-checkbox"
                    //                     checked={
                    //                         selectedElements?.find(
                    //                             (item) => item.id === element.id
                    //                         )
                    //                             ? true
                    //                             : false
                    //                     }
                    //                 />
                    //             )}
                    //             {!isEditBehavior && (
                    //                 <div>
                    //                     <FontIcon
                    //                         iconName={'Shapes'}
                    //                         className="cb-element-icon"
                    //                     />
                    //                 </div>
                    //             )}
                    //             <div className="cb-scene-builder-element-title">
                    //                 <div className="cb-scene-builder-element-name">
                    //                     {searchText
                    //                         ? Utils.getMarkedHtmlBySearch(
                    //                               element.displayName,
                    //                               searchText
                    //                           )
                    //                         : element.displayName}
                    //                 </div>
                    //                 {!isEditBehavior && (
                    //                     <div className="cb-scene-builder-element-item-meta">
                    //                         {t(
                    //                             '3dSceneBuilder.elementMetaText',
                    //                             {
                    //                                 numBehaviors: ViewerConfigUtility.getElementMetaData(
                    //                                     element,
                    //                                     config
                    //                                 )
                    //                             }
                    //                         )}
                    //                     </div>
                    //                 )}
                    //             </div>
                    //             {!toggleElementSelection && (
                    //                 <IconButton
                    //                     className={`${
                    //                         hoveredElement?.id === element.id
                    //                             ? 'cb-scene-builder-element-actions-hovered'
                    //                             : 'cb-scene-builder-element-actions'
                    //                     }`}
                    //                     title={t('more')}
                    //                     ariaLabel={t('more')}
                    //                     data-testid={`moreMenu-${index}`}
                    //                     menuIconProps={{
                    //                         iconName: 'MoreVertical',
                    //                         style: {
                    //                             fontWeight: 'bold',
                    //                             fontSize: 18,
                    //                             color: 'black'
                    //                         }
                    //                     }}
                    //                     onMenuClick={() => {
                    //                         setHoveredElement(element);
                    //                     }}
                    //                     menuProps={{
                    //                         onMenuDismissed: () => {
                    //                             setHoveredElement(null);
                    //                         },
                    //                         items:
                    //                     }}
                    //                 />
                    //             )}
                    //         </div>
                    //     )
                    // )
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
                    setIsConfirmDeleteDialogOpen(false);
                }}
                onConfirmDeletion={handleDeleteElement}
                setIsOpen={setIsConfirmDeleteDialogOpen}
            />
        </div>
    );
};

export default SceneElements;
