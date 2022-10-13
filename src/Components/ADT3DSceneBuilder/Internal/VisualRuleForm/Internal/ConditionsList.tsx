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
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { transformValueRangesIntoConditions } from '../VisualRuleFormUtility';
import { getStyles } from './ConditionsList.styles';
import {
    Conditions,
    IConditionsListProps,
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';

const LIST_KEY = 'cb-visual-rule-conditions-list';

const getClassNames = classNamesFunction<
    IConditionsListStylesProps,
    IConditionsListStyles
>();

const ConditionsList: React.FC<IConditionsListProps> = (props) => {
    // Props
    const { expressionType, onDeleteCondition, styles, valueRanges } = props;

    // Hooks
    const { t } = useTranslation();

    // Constants
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const getOverflowMenuItems = (
        conditionId: string
    ): IContextualMenuItem[] => [
        {
            key: `${conditionId}-edit-menu-item`,
            text: t('3dSceneBuilder.visualRuleForm.editCondition'),
            iconProps: {
                iconName: 'Edit'
            },
            onClick: () => {
                alert('Edit clicked');
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
    ];

    // State
    const getConditionItems = (): ICardboardListItem<Conditions>[] => {
        const conditions = transformValueRangesIntoConditions(
            valueRanges,
            expressionType
        );
        const viewModel: ICardboardListItem<Conditions>[] = conditions.map(
            (condition) => {
                return {
                    item: condition,
                    ariaLabel: `Condition for ${condition.primaryText}`,
                    textPrimary: condition.primaryText,
                    textSecondary: condition.secondaryText,
                    overflowMenuItems: getOverflowMenuItems(condition.id),
                    onClick: () => {
                        alert('Item clicked');
                    }
                };
            }
        );
        return viewModel;
    };

    const [conditions, setConditions] = useState(getConditionItems());

    // Effects
    // Update list everytime valueRanges and expressionType change
    useEffect(() => {
        setConditions(getConditionItems());
    }, [valueRanges, expressionType]);

    // Callbacks
    const handleOpenFlyout = useCallback(() => {
        // TODO: Open callout
        alert('New condition');
    }, []);

    return (
        <div className={classNames.container}>
            <Stack>
                <CardboardList<Conditions>
                    listKey={LIST_KEY}
                    items={conditions}
                />
                <ActionButton
                    data-testid={'visual-rule-add-condition'}
                    styles={classNames.subComponentStyles.addButton?.()}
                    onClick={handleOpenFlyout}
                >
                    {t('3dSceneBuilder.visualRuleForm.newCondition')}
                </ActionButton>
            </Stack>
        </div>
    );
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
