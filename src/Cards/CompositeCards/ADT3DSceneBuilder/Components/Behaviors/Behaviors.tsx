import {
    FontIcon,
    IconButton,
    IContextualMenuProps,
    Label,
    Separator,
    Text
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const [isBehaviorLibraryExpanded, setIsBehaviorLibraryExpanded] = useState(
        false
    );
    const behaviorToDeleteRef = useRef<{
        id: string;
        removeFromAllScenes?: boolean;
    }>(null);

    const [
        behaviorsInScene,
        behaviorsNotInScene
    ] = ViewerConfigUtility.getBehaviorsSegmentedByPresenceInScene(
        config,
        sceneId,
        behaviors
    );

    // Expand behavior library if no behaviors in active scene
    useEffect(() => {
        if (
            behaviorsInScene.length === 0 &&
            behaviorsNotInScene.length > 0 &&
            !isBehaviorLibraryExpanded
        ) {
            setIsBehaviorLibraryExpanded(true);
        }
    }, [behaviorsInScene]);

    const behaviorsInSceneSectionVisible =
        behaviorsInScene && behaviorsInScene.length > 0;
    const behaviorsNotInSceneSectionVisible =
        behaviorsNotInScene && behaviorsNotInScene.length > 0;

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                {behaviors.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    <div>
                        {behaviorsInSceneSectionVisible && (
                            <div>
                                <Text
                                    variant="medium"
                                    className="cb-behavior-list-section-label"
                                >
                                    {t('3dSceneBuilder.behaviorsInScene')}
                                </Text>
                                {behaviorsInScene.map((behavior) => (
                                    <BehaviorList
                                        key={behavior.id}
                                        behavior={behavior}
                                        behaviorToDeleteRef={
                                            behaviorToDeleteRef
                                        }
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
                        {behaviorsInSceneSectionVisible &&
                            behaviorsNotInSceneSectionVisible && (
                                <Separator
                                    styles={{
                                        root: {
                                            '&:before': {
                                                backgroundColor:
                                                    'var(--cb-color-bg-canvas-inset)'
                                            }
                                        }
                                    }}
                                />
                            )}
                        {behaviorsNotInSceneSectionVisible && (
                            <div>
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
                                                '3dSceneBuilder.behaviorsNotInScene'
                                            )}{' '}
                                            ({behaviorsNotInScene.length})
                                        </span>
                                    </Text>
                                </div>
                                {isBehaviorLibraryExpanded &&
                                    behaviorsNotInScene.map((behavior) => (
                                        <BehaviorList
                                            key={behavior.id}
                                            behavior={behavior}
                                            behaviorToDeleteRef={
                                                behaviorToDeleteRef
                                            }
                                            onBehaviorClick={onBehaviorClick}
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
                                    ))}
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
}> = ({
    behavior,
    onBehaviorClick,
    behaviorToDeleteRef,
    setIsConfirmDeleteOpen,
    segmentMode,
    onAddBehaviorToScene
}) => {
    const { t } = useTranslation();
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
                        onClick: () => onBehaviorClick(behavior)
                    },
                    {
                        key: 'manageLayers',
                        text: t('3dSceneBuilder.manageSceneLayer'),
                        iconProps: { iconName: 'MapLayers' },
                        disabled: true
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
                        }
                    }
                ]
            };
        } else {
            return {
                items: [
                    {
                        key: 'addToScene',
                        text: t('3dSceneBuilder.addBehaviorToScene'),
                        iconProps: { iconName: 'Add' },
                        onClick: () => onAddBehaviorToScene(behavior)
                    },
                    {
                        key: 'removeFromAllScenes',
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
            <Label className="cb-scene-builder-behavior-name">
                {behavior.id}
            </Label>
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
                menuProps={getBehaviorListItemMenuProps(behavior)}
            ></IconButton>
        </div>
    );
};

export default SceneBehaviors;
