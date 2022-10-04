import { IContextualMenuItem } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { IVisualRule } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IVisualRulesListProps } from './VisualRules.types';
/**
 *
 * Visual Rule List will handle the generation of ruleItems and the actions on a rule
 */

export const VisualRulesList: React.FC<IVisualRulesListProps> = ({
    ruleItems,
    onEditRule,
    onRemoveRule
}) => {
    const { t } = useTranslation();
    //list of data in carbboardlist shape
    const [listItems, setListItems] = useState<
        ICardboardListItem<IVisualRule>[]
    >([]);

    //making sure to display the correct listItem when one of the dependencies below changes
    useEffect(() => {
        //making sure to get the rules in cardboardlist data shape
        const listItems = getListItems(ruleItems, onRemoveRule, onEditRule, t);
        setListItems(listItems);
    }, [ruleItems, onRemoveRule, onEditRule, t]);

    return (
        <CardboardList<IVisualRule>
            listKey={'visualRules-in-behavior'}
            items={listItems}
        />
    );
};

function getListItems(
    rules: IVisualRule[],
    onRemoveRule: (ruleItem: string) => void,
    onEditRule: (ruleItem: string) => void,
    t: TFunction<string>
) {
    const getMenuItems = (item: IVisualRule): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                'data-testid': 'editRuleOverflow',
                text: t('3dSceneBuilder.editRule'),
                iconProps: { iconName: 'Edit' },
                onClick: () => onEditRule(item.id)
            },
            {
                key: 'remove',
                'data-testid': 'removeRuleOverflow',
                text: t('3dSceneBuilder.removeRule'),
                iconProps: { iconName: 'Delete' },
                onClick: () => onRemoveRule(item.id)
            }
        ];
    };

    return rules.map((item) => {
        const viewModel: ICardboardListItem<IVisualRule> = {
            ariaLabel: '',
            iconStart: { name: '' },
            item: item,
            openMenuOnClick: true,
            overflowMenuItems: getMenuItems(item),
            textPrimary: item.displayName,
            textSecondary: item.conditions.join(', ')
        };
        return viewModel;
    });
}
