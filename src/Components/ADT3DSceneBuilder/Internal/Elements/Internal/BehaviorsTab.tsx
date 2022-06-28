import React, {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ActionButton, IContextualMenuItem, useTheme } from '@fluentui/react';
import AddBehaviorCallout from './AddBehaviorCallout';
import { CardboardList } from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    getDebugLogger,
    sortAlphabetically
} from '../../../../../Models/Services/Utils';
import { useElementFormContext } from '../../../../../Models/Context/ElementsFormContext/ElementFormContext';
import { ElementFormContextActionType } from '../../../../../Models/Context/ElementsFormContext/ElementFormContext.types';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { useId } from '@fluentui/react-hooks';

const debugLogging = false;
const logDebugConsole = getDebugLogger('BehaviorsTab', debugLogging);

export interface IADT3DSceneBuilderElementBehaviorProps {
    onBehaviorClick: (behavior: IBehavior) => void;
    onCreateBehaviorWithElements: (preSearchedBehaviorName: string) => void;
    isCreateBehaviorDisabled?: boolean;
}
const BehaviorsTab: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    onBehaviorClick,
    onCreateBehaviorWithElements,
    isCreateBehaviorDisabled = false
}) => {
    // hooks
    const { t } = useTranslation();

    // contexts
    const { config } = useContext(SceneBuilderContext);
    const { elementFormDispatch, elementFormState } = useElementFormContext();

    // state
    const [
        isAddBehaviorCalloutVisible,
        setIsAddBehaviorCalloutVisible
    ] = useState(false);
    const [listItems, setListItems] = useState<ICardboardListItem<IBehavior>[]>(
        []
    );

    // data
    const calloutTarget = useId('calloutTarget');

    const behaviorsOnElement = useMemo(
        () =>
            config?.configuration?.behaviors
                .filter((behavior) =>
                    elementFormState.linkedBehaviorIds.includes(behavior.id)
                )
                .sort(sortAlphabetically('displayName')) || [],
        [config?.configuration?.behaviors, elementFormState.linkedBehaviorIds]
    );

    const availableBehaviors = useMemo(
        () =>
            config?.configuration?.behaviors
                ?.filter((behavior) => {
                    return !behaviorsOnElement.some(
                        (x) => x.id === behavior.id
                    );
                })
                .sort(sortAlphabetically('displayName')) || [],
        [behaviorsOnElement, config?.configuration?.behaviors]
    );

    const removeBehavior = useCallback(
        (selectedBehavior: IBehavior) => {
            logDebugConsole(
                'debug',
                'Removing the behavior from the element. {selectedBehavior}',
                selectedBehavior
            );
            elementFormDispatch({
                type:
                    ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_REMOVE,
                payload: {
                    id: selectedBehavior.id
                }
            });

            // const updatedBehavior = ViewerConfigUtility.removeElementFromBehavior(
            //     elementFormState.elementToEdit,
            //     deepCopy(selectedBehavior)
            // );
        },
        [elementFormDispatch]
    );

    const addBehaviorToElement = useCallback(
        (selectedBehavior: IBehavior) => {
            logDebugConsole(
                'debug',
                'Adding the behavior to the element. {selectedBehavior}',
                selectedBehavior
            );
            elementFormDispatch({
                type:
                    ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD,
                payload: {
                    id: selectedBehavior.id
                }
            });

            // const updatedBehavior = ViewerConfigUtility.addElementToBehavior(
            //     elementFormState.elementToEdit,
            //     deepCopy(selectedBehavior)
            // );

            // // add the behavior to the element for rendering the list
            // setBehaviorsOnElement((previousState) => [
            //     ...previousState,
            //     updatedBehavior
            // ]);

            // // notify parent component of the behaviors that have been changed
            // setBehaviorsToEdit((previousState) => [
            //     ...previousState,
            //     updatedBehavior
            // ]);
        },
        [elementFormDispatch]
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
                onClick={() => setIsAddBehaviorCalloutVisible(true)}
            >
                {t('3dSceneBuilder.addBehaviorButton')}
            </ActionButton>
            {isAddBehaviorCalloutVisible && (
                <AddBehaviorCallout
                    calloutTarget={calloutTarget}
                    availableBehaviors={availableBehaviors}
                    hideCallout={() => setIsAddBehaviorCalloutVisible(false)}
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
