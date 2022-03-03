import {
    FontIcon,
    FontSizes,
    FontWeights,
    IContextualMenuItem,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Separator,
    Theme,
    useTheme
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { IBehavior, IScenesConfig } from '../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import { getLeftPanelStyles } from '../Shared/LeftPanel.styles';
import SearchHeader from '../Shared/SearchHeader';

interface Props {
    behaviors: Array<IBehavior>;
    onCreateBehaviorClick: () => void;
    onBehaviorClick: (behavior: IBehavior) => void;
    onRemoveBehaviorFromScene: (
        behaviorId: string,
        removeFromAllScenes?: boolean
    ) => void;
    onAddBehaviorToScene: (behavior: IBehavior) => void;
}

const SceneBehaviors: React.FC<Props> = ({
    onCreateBehaviorClick,
    onBehaviorClick,
    onRemoveBehaviorFromScene,
    behaviors,
    onAddBehaviorToScene
}) => {
    const { t } = useTranslation();
    const { config, sceneId } = useContext(SceneBuilderContext);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredItemsInScene, setFilteredItemsInScene] = useState<
        IBehavior[]
    >([]);
    const [filteredItemsNotInScene, setFilteredItemsNotInScene] = useState<
        IBehavior[]
    >([]);
    const [isBehaviorLibraryExpanded, setIsBehaviorLibraryExpanded] = useState(
        false
    );
    const [listItemsInScene, setListItemsInScene] = useState<
        ICardboardListItem<IBehavior>[]
    >([]);
    const [listItemsNotInScene, setListItemsNotInScene] = useState<
        ICardboardListItem<IBehavior>[]
    >([]);
    const behaviorToDeleteRef = useRef<{
        id: string;
        removeFromAllScenes?: boolean;
    }>(null);

    const [behaviorsInScene, behaviorsNotInScene] = useMemo(
        () =>
            ViewerConfigUtility.getBehaviorsSegmentedByPresenceInScene(
                config,
                sceneId,
                behaviors
            ),
        [config, sceneId, behaviors]
    );

    // add everything to the list on the first pass
    useEffect(() => {
        setFilteredItemsInScene(JSON.parse(JSON.stringify(behaviorsInScene)));
    }, [behaviorsInScene]);
    useEffect(() => {
        setFilteredItemsNotInScene(
            JSON.parse(JSON.stringify(behaviorsNotInScene))
        );
    }, [behaviorsNotInScene]);

    // Expand behavior library if no behaviors in active scene
    useEffect(() => {
        if (
            filteredItemsInScene.length === 0 &&
            filteredItemsNotInScene.length > 0 &&
            !isBehaviorLibraryExpanded
        ) {
            setIsBehaviorLibraryExpanded(true);
        }
    }, [filteredItemsInScene, filteredItemsNotInScene]);

    // apply filtering
    useEffect(() => {
        const filteredInScene = behaviorsInScene.filter((behavior) =>
            behavior.id.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredItemsInScene(filteredInScene);
        const filteredNotInScene = behaviorsNotInScene.filter((behavior) =>
            behavior.id.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredItemsNotInScene(filteredNotInScene);
        // if we find an item in the library, expand the library to show it
        if (
            searchText &&
            filteredNotInScene.length > 0 &&
            !isBehaviorLibraryExpanded
        ) {
            setIsBehaviorLibraryExpanded(true);
        }
    }, [searchText, behaviorsInScene, behaviorsNotInScene]);

    const itemsInSceneVisible = filteredItemsInScene?.length > 0;
    const itemsNotInSceneVisible = filteredItemsNotInScene?.length > 0;

    // generate the list of items to show - In Scene
    useEffect(() => {
        const listItems = getListItems(
            config,
            behaviorToDeleteRef,
            filteredItemsInScene,
            'InScene',
            onAddBehaviorToScene,
            onBehaviorClick,
            sceneId,
            setIsDeleteDialogOpen,
            t
        );
        setListItemsInScene(listItems);
    }, [
        config,
        behaviorToDeleteRef,
        filteredItemsInScene,
        'InScene',
        onAddBehaviorToScene,
        onBehaviorClick,
        sceneId,
        setIsDeleteDialogOpen
    ]);
    // generate the list of items to show - NOT In Scene
    useEffect(() => {
        const listItems = getListItems(
            config,
            behaviorToDeleteRef,
            filteredItemsNotInScene,
            'NotInScene',
            undefined,
            onBehaviorClick,
            sceneId,
            setIsDeleteDialogOpen,
            t
        );
        setListItemsNotInScene(listItems);
    }, [
        config,
        behaviorToDeleteRef,
        filteredItemsNotInScene,
        'InScene',
        onAddBehaviorToScene,
        onBehaviorClick,
        sceneId,
        setIsDeleteDialogOpen
    ]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const customStyles = getStyles(theme);
    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className={commonPanelStyles.rootListContainer}>
                {behaviors.length === 0 ? (
                    <p className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    <div>
                        <SearchHeader
                            onSearchTextChange={setSearchText}
                            placeholder={t(
                                '3dSceneBuilder.searchBehaviorsPlaceholder'
                            )}
                            searchText={searchText}
                        />
                        {!itemsInSceneVisible && !itemsNotInSceneVisible ? (
                            <p className="cb-scene-builder-left-panel-text">
                                {t('3dSceneBuilder.noResults')}
                            </p>
                        ) : (
                            <></>
                        )}
                        {/* List of behaviors in the scene */}
                        {itemsInSceneVisible && (
                            <div>
                                <div className={customStyles.listSectionLabel}>
                                    {t('3dSceneBuilder.behaviorsInSceneTitle')}
                                </div>
                                <CardboardList<IBehavior>
                                    items={listItemsInScene}
                                    listKey={'behaviors-in-scene'}
                                    textToHighlight={searchText}
                                />
                            </div>
                        )}
                        {/* Separator between lists */}
                        {itemsInSceneVisible && itemsNotInSceneVisible && (
                            <Separator />
                        )}
                        {/* Items not in the scene */}
                        {itemsNotInSceneVisible && (
                            <div>
                                {/* TODO: convert to button for keyboard acessibility */}
                                <div
                                    className="cb-scene-builder-left-panel-collapse-chevron-header"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsBehaviorLibraryExpanded(
                                            (prev) => !prev
                                        );
                                    }}
                                >
                                    <FontIcon
                                        iconName={'ChevronRight'}
                                        className={`cb-chevron ${
                                            isBehaviorLibraryExpanded
                                                ? 'cb-expanded'
                                                : 'cb-collapsed'
                                        }`}
                                    />
                                    <div
                                        className={
                                            customStyles.listSectionLabel
                                        }
                                    >
                                        {t(
                                            '3dSceneBuilder.behaviorsNotInSceneTitle'
                                        )}{' '}
                                        ({listItemsNotInScene.length})
                                    </div>
                                </div>

                                {isBehaviorLibraryExpanded && (
                                    <CardboardList<IBehavior>
                                        items={listItemsNotInScene}
                                        listKey={'behaviors-not-in-scene'}
                                        textToHighlight={searchText}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="cb-scene-builder-footer-container">
                <PrimaryButton
                    className="cb-scene-builder-create-button"
                    onClick={() => onCreateBehaviorClick()}
                    text={t('3dSceneBuilder.newBehavior')}
                />
            </div>
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirmDeletion={() => {
                    onRemoveBehaviorFromScene(
                        behaviorToDeleteRef.current.id,
                        behaviorToDeleteRef.current.removeFromAllScenes
                    );
                    behaviorToDeleteRef.current = null;
                }}
                onCancel={() => {
                    behaviorToDeleteRef.current = null;
                }}
                message={
                    behaviorToDeleteRef.current
                        ? behaviorToDeleteRef.current.removeFromAllScenes
                            ? t(
                                  '3dSceneBuilder.confirmRemoveBehaviorFromAllScenes'
                              )
                            : t('3dSceneBuilder.confirmRemoveBehaviorFromScene')
                        : null
                }
            />
        </div>
    );
};

function getListItems(
    config: IScenesConfig,
    behaviorToDeleteRef: React.MutableRefObject<{
        id: string;
        removeFromAllScenes?: boolean;
    }>,
    filteredElements: IBehavior[],
    listType: 'InScene' | 'NotInScene',
    onAddBehaviorToScene: (behavior: IBehavior) => void | undefined,
    onListItemClick: (element: IBehavior) => void,
    sceneId: string,
    setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    t: TFunction<string>
): ICardboardListItem<IBehavior>[] {
    const getMenuItems = (
        type: 'InScene' | 'NotInScene',
        behavior: IBehavior
    ): IContextualMenuItem[] => {
        switch (type) {
            case 'InScene':
                return [
                    {
                        key: 'edit',
                        text: t('3dSceneBuilder.editBehavior'),
                        iconProps: { iconName: 'Edit' },
                        onClick: () => onListItemClick(behavior),
                        id: `editOverflow-${behavior.id}`,
                        'data-testid': `editOverflow-${behavior.id}`
                    },
                    {
                        key: 'manageLayers',
                        text: t('3dSceneBuilder.manageSceneLayer'),
                        iconProps: { iconName: 'MapLayers' },
                        disabled: true,
                        id: `manageLayersOverflow-${behavior.id}`,
                        'data-testid': `manageLayersOverflow-${behavior.id}`
                    },
                    {
                        key: 'removeFromThisScene',
                        text: t('3dSceneBuilder.removeBehaviorFromScene'),
                        iconProps: { iconName: 'Delete' },
                        onClick: () => {
                            behaviorToDeleteRef.current = {
                                id: behavior.id,
                                removeFromAllScenes: false
                            };
                            setIsDeleteDialogOpen(true);
                        },
                        id: `removeFromSceneOverflow-${behavior.id}`,
                        'data-testid': `removeFromSceneOverflow-${behavior.id}`
                    }
                ];
            default:
                return [
                    {
                        key: 'addToScene',
                        id: `addToScene-${behavior.id}`,
                        'data-testid': `addToScene-${behavior.id}`,
                        text: t('3dSceneBuilder.addBehaviorToScene'),
                        iconProps: { iconName: 'Add' },
                        onClick: () => onAddBehaviorToScene(behavior)
                    },
                    {
                        key: 'removeFromAllScenes',
                        id: `removeFromAllOverflow-${behavior.id}`,
                        'data-testid': `removeFromAllOverflow-${behavior.id}`,
                        text: t('3dSceneBuilder.removeBehaviorFromAllScenes'),
                        iconProps: { iconName: 'Delete' },
                        onClick: () => {
                            behaviorToDeleteRef.current = {
                                id: behavior.id,
                                removeFromAllScenes: true
                            };
                            setIsDeleteDialogOpen(true);
                        }
                    }
                ];
                break;
        }
    };
    return filteredElements.map((item) => {
        const metadata = ViewerConfigUtility.getBehaviorMetaData(
            config,
            sceneId,
            item
        );
        let viewModel: ICardboardListItem<IBehavior>;
        if (listType === 'InScene') {
            viewModel = {
                ariaLabel: '',
                iconStartName: 'Ringer',
                item: item,
                onClick: onListItemClick,
                overflowMenuItems: getMenuItems(listType, item),
                textPrimary: item.id,
                textSecondary: t('3dSceneBuilder.behaviorMetaText', {
                    numElementsInActiveScene: metadata.numElementsInActiveScene,
                    numSceneRefs: metadata.numSceneRefs
                })
            };
        } else {
            viewModel = {
                ariaLabel: '',
                iconStartName: 'Ringer',
                item: item,
                openMenuOnClick: true,
                overflowMenuItems: getMenuItems(listType, item),
                textPrimary: item.id,
                textSecondary: t('3dSceneBuilder.behaviorMetaText', {
                    numElementsInActiveScene: metadata.numElementsInActiveScene,
                    numSceneRefs: metadata.numSceneRefs
                })
            };
        }

        return viewModel;
    });
}

export default SceneBehaviors;

const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        listSectionLabel: {
            fontSize: FontSizes.size14,
            fontWeight: FontWeights.semibold,
            marginBottom: 4,
            paddingLeft: 8
        } as IStyle
    });
});
