import React, { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ActionButton, IContextualMenuItem, useTheme } from '@fluentui/react';
import { BehaviorState } from '../../../ADT3DSceneBuilder.types';
import AddBehaviorCallout from '../AddBehaviorCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../../../../Models/Classes/3DVConfig';
import { CardboardList } from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';

export interface IADT3DSceneBuilderElementBehaviorProps {
    behaviors: Array<IBehavior>;
    elementToEdit: ITwinToObjectMapping;
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: () => void;
    updateBehaviorsToEdit: (behaviorsToEdit: Array<IBehavior>) => void;
}
const BehaviorsTab: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    behaviors,
    elementToEdit,
    onBehaviorClick,
    onCreateBehaviorWithElements,
    updateBehaviorsToEdit
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
                    elementToEdit,
                    JSON.parse(JSON.stringify(behaviors))
                );

                draft.availableBehaviors = ViewerConfigUtility.getAvailableBehaviorsForElement(
                    elementToEdit,
                    JSON.parse(JSON.stringify(behaviors))
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
    };

    const setBehaviorToEdit = (item: IBehavior) => {
        setBehaviorState(
            produce((draft) => {
                draft.behaviorToEdit = item;
            })
        );
    };

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
        removeBehavior
    ]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            {behaviorState.behaviorsOnElement?.length === 0 && (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.noBehaviorsOnElement')}
                </div>
            )}
            <CardboardList<IBehavior>
                items={listItems}
                listKey={`behavior-list`}
            />
            <div>
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
            </div>
            {showAddBehavior && (
                <AddBehaviorCallout
                    calloutTarget={calloutTarget}
                    availableBehaviors={behaviorState.availableBehaviors}
                    hideCallout={() => setShowAddBehavior(false)}
                    onAddBehavior={addBehaviorToElement}
                    onCreateBehaviorWithElements={onCreateBehaviorWithElements}
                />
            )}
        </>
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
            iconStartName: 'Ringer',
            item: item,
            openMenuOnClick: true,
            overflowMenuItems: getMenuItems(item),
            textPrimary: item.id
            // title: t('delete')
        };

        return viewModel;
    });
}

export default BehaviorsTab;
