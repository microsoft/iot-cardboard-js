import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton, FontIcon, IconButton } from '@fluentui/react';
import {
    BehaviorState,
    IADT3DSceneBuilderElementBehaviorProps
} from '../../ADT3DSceneBuilder.types';
import AddBehaviorCallout from './AddBehaviorCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import { IBehavior } from '../../../../../Models/Classes/3DVConfig';

const ElementBehaviors: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    behaviors,
    elementToEdit,
    onBehaviorClick,
    onCreateBehaviorWithElements,
    updateBehaviorsToEdit
}) => {
    const { t } = useTranslation();
    const calloutTarget = 'calloutTarget';
    const calloutId = 'calloutId';
    const [showAddBehavior, setShowAddBehavior] = useState(false);
    const [behaviorState, setBehaviorState] = useState<BehaviorState>({
        behaviorToEdit: null,
        behaviorsToEdit: [],
        behaviorsOnElement: [],
        availableBehaviors: []
    });

    useEffect(() => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorsOnElement = ViewerConfigUtility.getBehaviorsOnElement(
                    elementToEdit,
                    behaviors
                );

                draft.availableBehaviors = ViewerConfigUtility.getAvailableBehaviorsForElement(
                    elementToEdit,
                    behaviors
                );
            })
        );
    }, [behaviors]);

    useEffect(() => {
        updateBehaviorsToEdit(behaviorState.behaviorsToEdit);
    }, [behaviorState.behaviorsToEdit]);

    const removeBehavior = () => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorsOnElement = ViewerConfigUtility.removeBehaviorFromList(
                    draft.behaviorsOnElement,
                    draft.behaviorToEdit
                );

                draft.behaviorToEdit = ViewerConfigUtility.removeElementFromBehavior(
                    elementToEdit,
                    draft.behaviorToEdit
                );

                draft.behaviorsToEdit.push(draft.behaviorToEdit);
                draft.availableBehaviors.push(draft.behaviorToEdit);
            })
        );
    };

    const addBehaviorToElement = (behavior: IBehavior) => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorToEdit = ViewerConfigUtility.addElementToBehavior(
                    elementToEdit,
                    behavior
                );
                draft.behaviorsOnElement.push(draft.behaviorToEdit);
                draft.behaviorsToEdit.push(draft.behaviorToEdit);
                draft.availableBehaviors = ViewerConfigUtility.removeBehaviorFromList(
                    draft.availableBehaviors,
                    draft.behaviorToEdit
                );
            })
        );
    };

    const showCallout = () => {
        setShowAddBehavior(true);
        // use setTimeout to allow the callout to render
        setTimeout(function () {
            document.getElementById(calloutId)?.focus();
        }, 10);
    };

    return (
        <div>
            <div className="cb-scene-builder-left-panel-element-behaviors">
                {behaviorState.behaviorsOnElement?.length === 0 && (
                    <div className="cb-scene-builder-element-behaviors-text">
                        {t('3dSceneBuilder.noBehaviorsOnElement')}
                    </div>
                )}
                {behaviorState.behaviorsOnElement.map((behavior) => {
                    return (
                        <div
                            id={behavior.id}
                            key={behavior.id}
                            className="cb-scene-builder-element-behavior-item"
                        >
                            <FontIcon
                                iconName={'Ringer'}
                                className="cb-scene-builder-element-behavior-item-icon"
                            />
                            <div className="cb-scene-builder-element-behavior-item-name">
                                {behavior.id}
                            </div>
                            <IconButton
                                title={t('more')}
                                ariaLabel={t('more')}
                                menuIconProps={{
                                    iconName: 'MoreVertical',
                                    style: {
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        color: 'var(--cb-color-text-primary)'
                                    }
                                }}
                                onMenuClick={() =>
                                    setBehaviorState(
                                        produce((draft) => {
                                            draft.behaviorToEdit = behavior;
                                        })
                                    )
                                }
                                menuProps={{
                                    items: [
                                        {
                                            key: 'modify',
                                            text: t(
                                                '3dSceneBuilder.modifyBehavior'
                                            ),
                                            iconProps: { iconName: 'Edit' },
                                            onClick: () =>
                                                onBehaviorClick(behavior)
                                        },
                                        {
                                            key: 'remove',
                                            text: t(
                                                '3dSceneBuilder.removeBehavior'
                                            ),
                                            iconProps: {
                                                iconName: 'Delete'
                                            },
                                            onClick: () => removeBehavior()
                                        }
                                    ]
                                }}
                            ></IconButton>
                        </div>
                    );
                })}
                <div>
                    <ActionButton
                        id={calloutTarget}
                        className="cb-scene-builder-left-panel-add-behavior"
                        style={{ color: 'var(--cb-color-theme-primary' }}
                        onClick={() => showCallout()}
                    >
                        {t('3dSceneBuilder.addBehaviorButton')}
                    </ActionButton>
                </div>
            </div>
            {showAddBehavior && (
                <AddBehaviorCallout
                    id={calloutId}
                    target={calloutTarget}
                    availableBehaviors={behaviorState.availableBehaviors}
                    hideCallout={() => setShowAddBehavior(false)}
                    addBehaviorToElement={addBehaviorToElement}
                    onCreateBehaviorWithElements={onCreateBehaviorWithElements}
                />
            )}
        </div>
    );
};

export default ElementBehaviors;
