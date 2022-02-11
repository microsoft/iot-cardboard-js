import {
    FontIcon,
    IconButton,
    IContextualMenuProps,
    SearchBox,
    Separator,
    Text
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utils } from '../../../../..';
import { IBehavior } from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { BehaviorListSegment } from '../../../../../Models/Constants/Enums';
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
                                {filteredItemsInScene.map((behavior, index) => (
                                    <BehaviorList
                                        key={behavior.id}
                                        index={index}
                                        behavior={behavior}
                                        behaviorToDeleteRef={
                                            behaviorToDeleteRef
                                        }
                                        searchText={searchText}
                                        onBehaviorClick={onBehaviorClick}
                                        setIsConfirmDeleteOpen={
                                            setIsConfirmDeleteOpen
                                        }
                                        segmentMode={
                                            BehaviorListSegment.InThisScene
                                        }
                                        onAddBehaviorToScene={
                                            onAddBehaviorToScene
                                        }
                                    />
                                ))}
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
                                {isBehaviorLibraryExpanded &&
                                    filteredItemsNotInScene.map(
                                        (behavior, index) => (
                                            <BehaviorList
                                                key={behavior.id}
                                                index={index}
                                                behavior={behavior}
                                                behaviorToDeleteRef={
                                                    behaviorToDeleteRef
                                                }
                                                searchText={searchText}
                                                onBehaviorClick={
                                                    onBehaviorClick
                                                }
                                                setIsConfirmDeleteOpen={
                                                    setIsConfirmDeleteOpen
                                                }
                                                segmentMode={
                                                    BehaviorListSegment.NotInThisScene
                                                }
                                                onAddBehaviorToScene={
                                                    onAddBehaviorToScene
                                                }
                                            />
                                        )
                                    )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <PrimaryButton
                className="cb-scene-builder-create-button"
                onClick={() => onCreateBehaviorClick()}
                text={t('3dSceneBuilder.newBehavior')}
            />
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

const BehaviorList: React.FC<{
    behavior: IBehavior;
    onBehaviorClick: (behavior: IBehavior) => any;
    behaviorToDeleteRef: React.MutableRefObject<any>;
    setIsConfirmDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
    segmentMode: BehaviorListSegment;
    onAddBehaviorToScene: (behavior: IBehavior) => any;
    index: number;
    searchText?: string;
}> = ({
    behavior,
    onBehaviorClick,
    behaviorToDeleteRef,
    setIsConfirmDeleteOpen,
    segmentMode,
    onAddBehaviorToScene,
    index,
    searchText
}) => {
    const { t } = useTranslation();
    const { config, sceneId } = useContext(SceneBuilderContext);
    const behaviorNotOnSceneEllipsisRef = useRef(null);

    const getBehaviorListItemMenuProps: (
        behavior: IBehavior
    ) => IContextualMenuProps = (behavior) => {
        if (segmentMode === BehaviorListSegment.InThisScene) {
            return {
                items: [
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
                ]
            };
        } else {
            return {
                items: [
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
                ]
            };
        }
    };

    const behaviorMetaData = ViewerConfigUtility.getBehaviorMetaData(
        config,
        sceneId,
        behavior
    );

    return (
        <div
            className="cb-scene-builder-left-panel-behavior"
            key={behavior.id}
            onClick={() => {
                if (segmentMode === BehaviorListSegment.InThisScene) {
                    onBehaviorClick(behavior);
                } else {
                    behaviorNotOnSceneEllipsisRef?.current?.openMenu?.();
                }
            }}
        >
            <FontIcon iconName={'Shapes'} className="cb-behavior-icon" />
            <div className="cb-scene-builder-behavior-list-item">
                <span className="cb-scene-builder-behavior-name">
                    {searchText?.length
                        ? Utils.getMarkedHtmlBySearch(behavior.id, searchText)
                        : behavior.id}
                </span>
                <span className="cb-scene-builder-behavior-list-item-meta">
                    {t('3dSceneBuilder.behaviorMetaText', {
                        numElementsInActiveScene:
                            behaviorMetaData.numElementsInActiveScene,
                        numSceneRefs: behaviorMetaData.numSceneRefs
                    })}
                </span>
            </div>
            <IconButton
                componentRef={behaviorNotOnSceneEllipsisRef}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'black'
                    }
                }}
                data-testid={`moreMenu-${
                    segmentMode === BehaviorListSegment.InThisScene
                        ? 'inScene'
                        : 'notInScene'
                }-${index}`}
                title={t('more')}
                ariaLabel={t('more')}
                menuProps={getBehaviorListItemMenuProps(behavior)}
            ></IconButton>
        </div>
    );
};

export default SceneBehaviors;
