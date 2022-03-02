import {
    FontIcon,
    IContextualMenuItem,
    SearchBox,
    Separator,
    Text
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBehavior } from '../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../CardboardList/CardboardList';
import { CardboardListItemProps } from '../../../CardboardList/CardboardListItem';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';

interface Props {
    behaviors: Array<IBehavior>;
    onCreateBehaviorClick: () => any;
    onBehaviorClick: (behavior: IBehavior) => any;
    onRemoveBehaviorFromScene: (
        behaviorId: string,
        removeFromAllScenes?: boolean
    ) => any;
    onAddBehaviorToScene: (behavior: IBehavior) => any;
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

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
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
            console.log(
                'Expanding library',
                searchText,
                filteredNotInScene.length,
                isBehaviorLibraryExpanded
            );
            setIsBehaviorLibraryExpanded(true);
        }
    }, [searchText, behaviorsInScene, behaviorsNotInScene]);

    const itemsInSceneVisible = filteredItemsInScene?.length > 0;
    const itemsNotInSceneVisible = filteredItemsNotInScene?.length > 0;

    const getOverflowMenuItemsInScene = (
        behavior: IBehavior
    ): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                text: t('3dSceneBuilder.editBehavior'),
                iconProps: { iconName: 'Edit' },
                onClick: () => onBehaviorClick(behavior),
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
                    setIsConfirmDeleteOpen(true);
                },
                id: `removeFromSceneOverflow-${behavior.id}`,
                'data-testid': `removeFromSceneOverflow-${behavior.id}`
            }
        ];
    };
    const getOverflowMenuItemsNotInScene = (
        behavior: IBehavior
    ): IContextualMenuItem[] => {
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
                    setIsConfirmDeleteOpen(true);
                }
            }
        ];
    };
    const getListItemPropsInScene = (
        item
    ): CardboardListItemProps<IBehavior> => {
        const metadata = ViewerConfigUtility.getBehaviorMetaData(
            config,
            sceneId,
            item
        );
        return {
            ariaLabel: '',
            iconStartName: 'Ringer',
            onClick: onBehaviorClick,
            overflowMenuItems: getOverflowMenuItemsInScene(item),
            textPrimary: item.id,
            textSecondary: t('3dSceneBuilder.behaviorMetaText', {
                numElementsInActiveScene: metadata.numElementsInActiveScene,
                numSceneRefs: metadata.numSceneRefs
            })
        };
    };

    const getListItemPropsNotInScene = (
        item
    ): CardboardListItemProps<IBehavior> => {
        const metadata = ViewerConfigUtility.getBehaviorMetaData(
            config,
            sceneId,
            item
        );
        return {
            ariaLabel: '',
            iconStartName: 'Ringer',
            openMenuOnClick: true,
            overflowMenuItems: getOverflowMenuItemsNotInScene(item),
            textPrimary: item.id,
            textSecondary: t('3dSceneBuilder.behaviorMetaText', {
                numElementsInActiveScene: metadata.numElementsInActiveScene,
                numSceneRefs: metadata.numSceneRefs
            })
        };
    };

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                {behaviors.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    <div>
                        <div className="cb-scene-builder-behavior-search-box">
                            <SearchBox
                                placeholder={t(
                                    '3dSceneBuilder.searchBehaviorsPlaceholder'
                                )}
                                onChange={(_e, value) => setSearchText(value)}
                                value={searchText}
                            />
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
                                <div className="cb-behavior-list-section-label-top-container">
                                    <Text
                                        variant="medium"
                                        className="cb-behavior-list-section-label"
                                    >
                                        {t(
                                            '3dSceneBuilder.behaviorsInSceneTitle'
                                        )}
                                    </Text>
                                </div>
                                <CardboardList<IBehavior>
                                    items={filteredItemsInScene}
                                    getListItemProps={getListItemPropsInScene}
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
                                    <Text
                                        variant="medium"
                                        className="cb-behavior-list-section-label"
                                    >
                                        <span>
                                            {t(
                                                '3dSceneBuilder.behaviorsNotInSceneTitle'
                                            )}{' '}
                                            ({filteredItemsNotInScene.length})
                                        </span>
                                    </Text>
                                </div>

                                {isBehaviorLibraryExpanded && (
                                    <CardboardList<IBehavior>
                                        items={filteredItemsNotInScene}
                                        getListItemProps={
                                            getListItemPropsNotInScene
                                        }
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
                isOpen={isConfirmDeleteOpen}
                setIsOpen={setIsConfirmDeleteOpen}
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

export default SceneBehaviors;
