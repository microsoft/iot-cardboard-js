import {
    FontIcon,
    IconButton,
    IContextualMenuProps,
    Label,
    Separator,
    Text
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBehavior } from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
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
}

const SceneBehaviors: React.FC<Props> = ({
    onCreateBehaviorClick,
    onBehaviorClick,
    onRemoveBehaviorFromScene,
    behaviors
}) => {
    const { t } = useTranslation();
    const { config, sceneId } = useContext(SceneBuilderContext);

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const behaviorIdToDelete = useRef(null);

    if (!config) return null;

    const [
        behaviorsOnElements,
        behaviorsNotOnElements
    ] = ViewerConfigUtility.getBehaviorsSegmentedByPresenceOnSceneElements(
        config,
        sceneId,
        behaviors
    );

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                {behaviors.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    <div>
                        <div>
                            <Text
                                variant="medium"
                                className="cb-behavior-list-section-label"
                            >
                                {t('3dSceneBuilder.onElements')}
                            </Text>
                            {behaviorsOnElements.map((behavior) => (
                                <BehaviorList
                                    key={behavior.id}
                                    behavior={behavior}
                                    behaviorIdToDelete={behaviorIdToDelete}
                                    onBehaviorClick={onBehaviorClick}
                                    setIsConfirmDeleteOpen={
                                        setIsConfirmDeleteOpen
                                    }
                                />
                            ))}
                        </div>
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
                        <div>
                            <Text
                                variant="medium"
                                className="cb-behavior-list-section-label"
                            >
                                {t('3dSceneBuilder.notOnElements')}
                            </Text>
                            {behaviorsNotOnElements.map((behavior) => (
                                <BehaviorList
                                    key={behavior.id}
                                    behavior={behavior}
                                    behaviorIdToDelete={behaviorIdToDelete}
                                    onBehaviorClick={onBehaviorClick}
                                    setIsConfirmDeleteOpen={
                                        setIsConfirmDeleteOpen
                                    }
                                />
                            ))}
                        </div>
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
                    onRemoveBehaviorFromScene(behaviorIdToDelete.current);
                    behaviorIdToDelete.current = null;
                }}
                onCancel={() => {
                    behaviorIdToDelete.current = null;
                }}
            />
        </div>
    );
};

const BehaviorList: React.FC<{
    behavior: IBehavior;
    onBehaviorClick: (behavior: IBehavior) => any;
    behaviorIdToDelete: React.MutableRefObject<any>;
    setIsConfirmDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    behavior,
    onBehaviorClick,
    behaviorIdToDelete,
    setIsConfirmDeleteOpen
}) => {
    const { t } = useTranslation();

    const getBehaviorListItemMenuProps: (
        behavior: IBehavior
    ) => IContextualMenuProps = (behavior) => ({
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
                key: 'remove',
                text: t('3dSceneBuilder.removeBehaviorFromScene'),
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    behaviorIdToDelete.current = behavior.id;
                    setIsConfirmDeleteOpen(true);
                }
            }
        ]
    });

    return (
        <div
            className="cb-scene-builder-left-panel-behavior"
            key={behavior.id}
            onClick={() => onBehaviorClick(behavior)}
        >
            <FontIcon iconName={'Shapes'} className="cb-behavior-icon" />
            <Label className="cb-scene-builder-behavior-name">
                {behavior.id}
            </Label>
            <IconButton
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
