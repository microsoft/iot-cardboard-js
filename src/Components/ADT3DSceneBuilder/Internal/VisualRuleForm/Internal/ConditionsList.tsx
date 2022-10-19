import {
    ActionButton,
    classNamesFunction,
    IContextualMenuItem,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createGUID } from '../../../../../Models/Services/Utils';
import {
    IDTDLPropertyType,
    IExpressionRangeType,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    isNumericType,
    transformValueRangesIntoConditions
} from '../VisualRuleFormUtility';
import ConditionsCallout from './ConditionsCallout/ConditionsCallout';
import { getStyles } from './ConditionsList.styles';
import {
    CalloutInfo,
    Condition,
    IConditionsListProps,
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';

const LIST_KEY = 'cb-visual-rule-conditions-list';
const getDefaultCondition = (type: IDTDLPropertyType): IValueRange => ({
    id: createGUID(),
    values: isNumericType(type) ? [0, 1] : [],
    visual: {
        color: null,
        iconName: null,
        labelExpression: null
    }
});

const getClassNames = classNamesFunction<
    IConditionsListStylesProps,
    IConditionsListStyles
>();

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

    // Constants
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
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
                        isOpen: true,
                        selectedCondition: valueRanges.find(
                            (vr) => vr.id === conditionId
                        ),
                        selectedTarget: `#${LIST_KEY}`
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
                },
                data: {
                    id: conditionId
                }
            }
        ],
        [onDeleteCondition, t, valueRanges]
    );

    const getConditionItems = useCallback(
        (
            valueRanges: IValueRange[],
            expressionType: IExpressionRangeType
        ): ICardboardListItem<Condition>[] => {
            const conditions = transformValueRangesIntoConditions(
                valueRanges,
                expressionType
            );
            const viewModel: ICardboardListItem<Condition>[] = conditions.map(
                (condition) => {
                    return {
                        item: condition,
                        ariaLabel: `Condition for ${condition.primaryText}`,
                        textPrimary: condition.primaryText,
                        textSecondary: condition.secondaryText,
                        overflowMenuItems: getOverflowMenuItems(condition.id),
                        onClick: () => {
                            setCalloutInfo({
                                isOpen: true,
                                selectedCondition: valueRanges.find(
                                    (vr) => vr.id === condition.id
                                ),
                                selectedTarget: `#${LIST_KEY}`
                            });
                        }
                    };
                }
            );
            return viewModel;
        },
        [getOverflowMenuItems]
    );

    // State
    const [conditions, setConditions] = useState(
        getConditionItems(valueRanges, expressionType)
    );

    const [calloutInfo, setCalloutInfo] = useState<CalloutInfo>({
        isOpen: false,
        selectedCondition: null,
        selectedTarget: null
    });

    // Effects
    // Update list everytime valueRanges and expressionType change
    useEffect(() => {
        setConditions(getConditionItems(valueRanges, expressionType));
    }, [valueRanges, expressionType, getConditionItems]);

    // Callbacks
    const handleOpenNewConditionFlyout = useCallback(() => {
        setCalloutInfo({
            isOpen: true,
            selectedCondition: getDefaultCondition(valueRangeType),
            selectedTarget: `#${LIST_KEY}`
        });
    }, [valueRangeType]);

    const handleDismissFlyout = useCallback(() => {
        setCalloutInfo({
            isOpen: false,
            selectedCondition: null,
            selectedTarget: ''
        });
    }, []);

    return (
        <>
            <div className={classNames.container}>
                <Stack>
                    <CardboardList<Condition>
                        listProps={{
                            id: LIST_KEY
                        }}
                        listKey={LIST_KEY}
                        items={conditions}
                    />
                    <ActionButton
                        id={'visual-rule-add-condition'}
                        data-testid={'visual-rule-add-condition'}
                        styles={classNames.subComponentStyles.addButton?.()}
                        onClick={handleOpenNewConditionFlyout}
                    >
                        {t('3dSceneBuilder.visualRuleForm.newCondition')}
                    </ActionButton>
                </Stack>
            </div>
            {calloutInfo.isOpen && (
                <ConditionsCallout
                    isOpen={calloutInfo.isOpen}
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
