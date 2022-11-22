import {
    ActionButton,
    classNamesFunction,
    Icon,
    IContextualMenuItem,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDefaultVisualRuleCondition } from '../../../../../Models/Classes/3DVConfig';
import {
    IExpressionRangeType,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { defaultSwatchColors } from '../../../../../Theming/Palettes';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    getNextColor,
    transformValueRangesIntoConditions
} from '../VisualRuleFormUtility';
import ConditionsCallout from './ConditionsCallout/ConditionsCallout';
import { getStyles } from './ConditionsList.styles';
import {
    CalloutInfo,
    CalloutInfoType,
    Condition,
    IConditionsListProps,
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';

const getClassNames = classNamesFunction<
    IConditionsListStylesProps,
    IConditionsListStyles
>();

const defaultCalloutInfo: CalloutInfo = {
    calloutType: CalloutInfoType.inactive,
    selectedCondition: null,
    selectedTarget: ''
};

const CONDITIONS_ITEM_ID_PREFIX = 'cb-visual-rule-conditions-list-item-';
const CONDITIONS_ADD_BUTTON_TEST_ID = 'cb-visual-rule-add-condition-button';

const ConditionsList: React.FC<IConditionsListProps> = (props) => {
    // Props
    const {
        expressionType,
        onDeleteCondition,
        onSaveCondition,
        styles,
        valueRanges,
        valueRangeType
    } = props;

    // Hooks
    const { t } = useTranslation();
    const addButtonId = useId('cb-add-conditions');
    const LIST_KEY = useId('cb-visual-rule-conditions-list');

    // Constants
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const getListItemId = (id: string) => {
        return CONDITIONS_ITEM_ID_PREFIX + id;
    };

    const [calloutInfo, setCalloutInfo] = useState<CalloutInfo>(
        defaultCalloutInfo
    );

    // Callbacks
    const handleOpenNewConditionFlyout = useCallback(() => {
        setCalloutInfo({
            calloutType: CalloutInfoType.create,
            selectedCondition: getDefaultVisualRuleCondition(
                valueRangeType,
                getNextColor(valueRanges, defaultSwatchColors)
            ),
            selectedTarget: `#${addButtonId}`
        });
    }, [valueRangeType]);

    const handleDismissFlyout = useCallback(() => {
        setCalloutInfo(defaultCalloutInfo);
    }, []);

    const getOverflowMenuItems = useCallback(
        (conditionId: string): IContextualMenuItem[] => [
            {
                key: `${conditionId}-edit-menu-item`,
                text: t('3dSceneBuilder.visualRuleForm.editCondition'),
                iconProps: {
                    iconName: 'Edit'
                },
                onClick: () => {
                    setCalloutInfo({
                        calloutType: CalloutInfoType.edit,
                        selectedCondition: valueRanges.find(
                            (vr) => vr.id === conditionId
                        ),
                        selectedTarget: `#${getListItemId(conditionId)}`
                    });
                },
                data: {
                    id: conditionId
                }
            },
            {
                key: `${conditionId}-delete-menu-item`,
                text: t('3dSceneBuilder.visualRuleForm.deleteCondition'),
                iconProps: {
                    iconName: 'Delete'
                },
                onClick: (_ev, item) => {
                    onDeleteCondition(item.data.id);
                    handleDismissFlyout();
                },
                data: {
                    id: conditionId
                }
            }
        ],
        [handleDismissFlyout, onDeleteCondition, t, valueRanges]
    );

    const renderBadge = useCallback((iconName: string, color: string) => {
        return (
            <Icon
                iconName={iconName}
                styles={classNames.subComponentStyles.badgeIcon({ color })}
            />
        );
    }, []);

    const renderMeshColoring = useCallback((color: string) => {
        return (
            <Icon
                iconName={'CubeShape'}
                styles={classNames.subComponentStyles.meshIcon({ color })}
            />
        );
    }, []);

    const getConditionItems = useCallback(
        (
            valueRanges: IValueRange[],
            expressionType: IExpressionRangeType
        ): ICardboardListItem<Condition>[] => {
            const conditions = transformValueRangesIntoConditions(
                valueRanges,
                expressionType,
                t
            );
            const viewModel: ICardboardListItem<Condition>[] = conditions.map(
                (condition) => {
                    return {
                        id: getListItemId(condition.id),
                        item: condition,
                        ariaLabel: `Condition for ${condition.primaryText}`,
                        textPrimary: condition.primaryText,
                        textSecondary: condition.secondaryText,
                        overflowMenuItems: getOverflowMenuItems(condition.id),
                        iconStart: condition.hasBadge
                            ? () =>
                                  renderBadge(
                                      condition.iconName,
                                      condition.color
                                  )
                            : () => renderMeshColoring(condition.color),
                        onClick: () => {
                            setCalloutInfo({
                                calloutType: CalloutInfoType.edit,
                                selectedCondition: valueRanges.find(
                                    (vr) => vr.id === condition.id
                                ),
                                selectedTarget: `#${getListItemId(
                                    condition.id
                                )}`
                            });
                        },
                        buttonProps: {
                            customStyles: classNames.subComponentStyles.itemButton(
                                { isUnlabeled: condition.isUnlabeled }
                            )
                        }
                    };
                }
            );
            return viewModel;
        },
        [getOverflowMenuItems, t]
    );

    // State
    const [conditions, setConditions] = useState(
        getConditionItems(valueRanges, expressionType)
    );

    // Effects
    // Update list everytime valueRanges and expressionType change
    useEffect(() => {
        setConditions(getConditionItems(valueRanges, expressionType));
    }, [valueRanges, expressionType, getConditionItems]);

    return (
        <>
            <div className={classNames.root}>
                <Stack>
                    <CardboardList<Condition>
                        listProps={{
                            id: LIST_KEY
                        }}
                        listKey={LIST_KEY}
                        items={conditions}
                    />
                    <ActionButton
                        id={addButtonId}
                        data-testid={CONDITIONS_ADD_BUTTON_TEST_ID}
                        styles={classNames.subComponentStyles.addButton?.()}
                        onClick={handleOpenNewConditionFlyout}
                    >
                        {t('3dSceneBuilder.visualRuleForm.newCondition')}
                    </ActionButton>
                </Stack>
            </div>
            {calloutInfo.calloutType !== CalloutInfoType.inactive && (
                <ConditionsCallout
                    calloutType={calloutInfo.calloutType}
                    onDismiss={handleDismissFlyout}
                    onSave={onSaveCondition}
                    target={calloutInfo.selectedTarget}
                    valueRange={calloutInfo.selectedCondition}
                    valueRangeType={valueRangeType}
                />
            )}
        </>
    );
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
