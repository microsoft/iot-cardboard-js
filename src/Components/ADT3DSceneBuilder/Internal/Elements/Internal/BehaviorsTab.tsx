import React, { memo, useCallback, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ActionButton, IContextualMenuItem, useTheme } from '@fluentui/react';
import { BehaviorState } from '../../../ADT3DSceneBuilder.types';
import AddBehaviorCallout from './AddBehaviorCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import { CardboardList } from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { deepCopy } from '../../../../../Models/Services/Utils';

export interface IADT3DSceneBuilderElementBehaviorProps {
    behaviors: Array<IBehavior>;
    elementToEdit: ITwinToObjectMapping;
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: (preSearchedBehaviorName: string) => void;
    updateBehaviorsToEdit: (behaviorsToEdit: Array<IBehavior>) => void;
    isCreateBehaviorDisabled?: boolean;
}
const BehaviorsTab: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    behaviors,
    elementToEdit,
    onBehaviorClick,
    onCreateBehaviorWithElements,
    updateBehaviorsToEdit,
    isCreateBehaviorDisabled = false
}) => {
    const { t } = useTranslation();
    const calloutTarget = 'calloutTarget';
    const [showAddBehavior, setShowAddBehavior] = useState(false);
    const [behaviorState, setBehaviorState] = useState<BehaviorState>({
        behaviorToEdit: null,
        behaviorsToEdit: [],
        behaviorsOnElement: [],
        availableBehaviors: []
    });
    const [listItems, setListItems] = useState<ICardboardListItem<IBehavior>[]>(
        []
    );

    useEffect(() => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorsOnElement = ViewerConfigUtility.getBehaviorsOnElement(
                    elementToEdit?.id,
                    deepCopy(behaviors)
                );

                draft.availableBehaviors = ViewerConfigUtility.getAvailableBehaviorsForElement(
                    elementToEdit,
                    deepCopy(behaviors)
                );
            })
        );
    }, [behaviors, elementToEdit]);

    useEffect(() => {
        updateBehaviorsToEdit(behaviorState.behaviorsToEdit);
    }, [behaviorState.behaviorsToEdit, updateBehaviorsToEdit]);

    const removeBehavior = useCallback(() => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorsOnElement = ViewerConfigUtility.removeBehaviorFromList(
                    draft.behaviorsOnElement,
                    draft.behaviorToEdit
                );

                draft.behaviorToEdit = ViewerConfigUtility.removeElementFromBehavior(
                    elementToEdit,
                    deepCopy(draft.behaviorToEdit)
                );

                draft.behaviorsToEdit.push(draft.behaviorToEdit);
                draft.availableBehaviors.push(draft.behaviorToEdit);
            })
        );
    }, [elementToEdit]);

    const addBehaviorToElement = useCallback(
        (behavior: IBehavior) => {
            setBehaviorState(
                produce((draft) => {
                    draft.behaviorToEdit = ViewerConfigUtility.addElementToBehavior(
                        elementToEdit,
                        deepCopy(behavior)
                    );
                    draft.behaviorsOnElement.push(draft.behaviorToEdit);
                    draft.behaviorsToEdit.push(draft.behaviorToEdit);
                    draft.availableBehaviors = ViewerConfigUtility.removeBehaviorFromList(
                        draft.availableBehaviors,
                        draft.behaviorToEdit
                    );
                })
            );
        },
        [elementToEdit]
    );

    const setBehaviorToEdit = useCallback((item: IBehavior) => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorToEdit = item;
            })
        );
    }, []);

    const showCallout = useCallback(() => {
        setShowAddBehavior(true);
    }, []);

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            behaviorState.behaviorsOnElement,
            setBehaviorToEdit,
            onBehaviorClick,
            removeBehavior,
            t
        );
        setListItems(listItems);
    }, [
        behaviorState.behaviorsOnElement,
        setBehaviorToEdit,
        onBehaviorClick,
        removeBehavior,
        t
    ]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <div className={commonPanelStyles.paddedLeftPanelBlock}>
            {behaviorState.behaviorsOnElement?.length === 0 && (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.elementBehaviorMeshTab.noDataMessage')}
                </div>
            )}
            <CardboardList<IBehavior>
                items={listItems}
                listKey={`behavior-list`}
            />
            <ActionButton
                id={calloutTarget}
                className="cb-scene-builder-left-panel-add-behavior"
                data-testid={'element-add-behavior'}
                style={{ color: 'var(--cb-color-theme-primary' }}
                styles={{
                    root: {
                        textAlign: 'start',
                        padding: '0px'
                    },
                    label: {
                        margin: '0px'
                    }
                }}
                onClick={showCallout}
            >
                {t('3dSceneBuilder.addBehaviorButton')}
            </ActionButton>
            {showAddBehavior && (
                <AddBehaviorCallout
                    calloutTarget={calloutTarget}
                    availableBehaviors={behaviorState.availableBehaviors}
                    hideCallout={() => setShowAddBehavior(false)}
                    onAddBehavior={addBehaviorToElement}
                    onCreateBehaviorWithElements={onCreateBehaviorWithElements}
                    isCreateBehaviorDisabled={isCreateBehaviorDisabled}
                />
            )}
        </div>
    );
};
function getListItems(
    filteredElements: IBehavior[],
    setBehaviorToEdit: (item: IBehavior) => void,
    onBehaviorClick: (item: IBehavior) => void,
    removeBehavior: () => void,
    t: TFunction<string>
) {
    const getMenuItems = (item: IBehavior): IContextualMenuItem[] => {
        return [
            {
                'data-testid': 'modifyOverflow',
                key: 'modify',
                iconProps: { iconName: 'Edit' },
                text: t('3dSceneBuilder.modifyBehavior'),
                onClick: () => {
                    setBehaviorToEdit(item);
                    onBehaviorClick(item);
                }
            },
            {
                'data-testid': 'removeOverflow',
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('3dSceneBuilder.removeBehavior'),
                onClick: () => {
                    setBehaviorToEdit(item);
                    removeBehavior();
                }
            }
        ];
    };
    return filteredElements.map((item) => {
        const viewModel: ICardboardListItem<IBehavior> = {
            ariaLabel: '',
            iconStart: { name: 'Ringer' },
            item: item,
            openMenuOnClick: true,
            overflowMenuItems: getMenuItems(item),
            textPrimary: item.displayName
        };

        return viewModel;
    });
}

export default memo(BehaviorsTab);
