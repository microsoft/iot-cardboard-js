import React, { memo, useCallback, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ActionButton, IContextualMenuItem, useTheme } from '@fluentui/react';
import AddBehaviorCallout from './AddBehaviorCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { deepCopy, getDebugLogger } from '../../../../../Models/Services/Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('BehaviorsTab', debugLogging);

export interface IADT3DSceneBuilderElementBehaviorProps {
    allBehaviors: Array<IBehavior>;
    elementToEdit: ITwinToObjectMapping;
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: (preSearchedBehaviorName: string) => void;
    updateBehaviorsToEdit: (behaviorsToEdit: Array<IBehavior>) => void;
    isCreateBehaviorDisabled?: boolean;
}
const BehaviorsTab: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    allBehaviors,
    elementToEdit,
    onBehaviorClick,
    onCreateBehaviorWithElements,
    updateBehaviorsToEdit,
    isCreateBehaviorDisabled = false
}) => {
    const { t } = useTranslation();
    const calloutTarget = 'calloutTarget';
    const [showAddBehavior, setShowAddBehavior] = useState(false);
    const [behaviorsToEdit, setBehaviorsToEdit] = useState<IBehavior[]>([]);
    const [behaviorsOnElement, setBehaviorsOnElement] = useState<IBehavior[]>(
        ViewerConfigUtility.getBehaviorsOnElement(
            elementToEdit?.id,
            allBehaviors
        ) || []
    );
    const [availableBehaviors, setAvailableBehaviors] = useState<IBehavior[]>(
        ViewerConfigUtility.getAvailableBehaviorsForElement(
            elementToEdit,
            deepCopy(allBehaviors)
        ) || []
    );
    const [listItems, setListItems] = useState<ICardboardListItem<IBehavior>[]>(
        []
    );

    useEffect(() => {
        updateBehaviorsToEdit(behaviorsToEdit);
    }, [behaviorsToEdit, updateBehaviorsToEdit]);

    const removeBehavior = useCallback(
        (selectedBehavior: IBehavior) => {
            logDebugConsole(
                'debug',
                'Removing the behavior from the element. {selectedBehavior}',
                selectedBehavior
            );

            // remove the behavior from the element for rendering the list
            setBehaviorsOnElement(
                ViewerConfigUtility.removeBehaviorFromList(
                    behaviorsOnElement,
                    selectedBehavior
                )
            );

            // notify parent component of the behaviors that have been changed
            setBehaviorsToEdit((previousState) => [
                ...previousState,
                selectedBehavior
            ]);

            // add the behavior to the list of options
            setAvailableBehaviors((previousState) => [
                ...previousState,
                selectedBehavior
            ]);
        },
        [behaviorsOnElement]
    );

    const addBehaviorToElement = useCallback(
        (selectedBehavior: IBehavior) => {
            logDebugConsole(
                'debug',
                'Adding the behavior to the element. {selectedBehavior}',
                selectedBehavior
            );

            // add the behavior to the element for rendering the list
            setBehaviorsOnElement((previousState) => [
                ...previousState,
                selectedBehavior
            ]);

            // notify parent component of the behaviors that have been changed
            setBehaviorsToEdit((previousState) => [
                ...previousState,
                selectedBehavior
            ]);

            // remove the behavior from the list of options
            setAvailableBehaviors(
                ViewerConfigUtility.removeBehaviorFromList(
                    availableBehaviors,
                    selectedBehavior
                )
            );
        },
        [availableBehaviors]
    );

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            behaviorsOnElement,
            onBehaviorClick,
            removeBehavior,
            t
        );
        logDebugConsole(
            'debug',
            'Building list items. {behaviorsOnElement, listItems}',
            behaviorsOnElement,
            listItems
        );
        setListItems(listItems);
    }, [behaviorsOnElement, onBehaviorClick, removeBehavior, t]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <div className={commonPanelStyles.paddedLeftPanelBlock}>
            {behaviorsOnElement?.length === 0 && (
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
                onClick={() => setShowAddBehavior(true)}
            >
                {t('3dSceneBuilder.addBehaviorButton')}
            </ActionButton>
            {showAddBehavior && (
                <AddBehaviorCallout
                    calloutTarget={calloutTarget}
                    availableBehaviors={availableBehaviors}
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
    onBehaviorClick: (item: IBehavior) => void,
    removeBehavior: (item: IBehavior) => void,
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
                    removeBehavior(item);
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
