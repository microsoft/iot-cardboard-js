import {
    FontIcon,
    IconButton,
    IContextualMenuProps,
    Label
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBehavior } from '../../../../../Models/Classes/3DVConfig';
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

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const behaviorIdToDelete = useRef(null);

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
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                {behaviors.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    behaviors.map((behavior) => (
                        <div
                            className="cb-scene-builder-left-panel-behavior"
                            key={behavior.id}
                            onClick={() => onBehaviorClick(behavior)}
                        >
                            <FontIcon
                                iconName={'Shapes'}
                                className="cb-behavior-icon"
                            />
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
                                menuProps={getBehaviorListItemMenuProps(
                                    behavior
                                )}
                            ></IconButton>
                        </div>
                    ))
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

export default SceneBehaviors;
