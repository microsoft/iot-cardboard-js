import { Stack, useTheme, Text, ActionButton } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';

import { useTranslation } from 'react-i18next';
import {
    getActionButtonStyles,
    getLeftPanelStyles
} from '../../Shared/LeftPanel.styles';
import { VisualRulesList } from '../VisualRules/VisualRuleList';
import { IVisualRule } from '../VisualRules/VisualRules.types';

const ROOT_LOC = '3dSceneBuilder.behaviorVisualRulesTab';
const LOC_KEYS = {
    addButtonText: `${ROOT_LOC}.addRuleButtonText`,
    noData: `${ROOT_LOC}.noData`,
    tabDescription: `${ROOT_LOC}.tabDescription`
};
export const VisualRulesTab: React.FC<any> = (_props: any) => {
    /**
     * TODO:
     * DO SOME STUFF SO YOU CAN GET THE LIST OF VISUAL RULES CREATED BASED ON THIS BEHAVIOR
     * THE DATA RETURNED FROM THE STEP ABOVE IS NOT CONSUMABLE BY CARDBOARDLIST SO YOU HAVE TO SHAPE RESULTS INTO IVISUALRULE FORM
     * WILL NEED TO IMPLEMENT CALLBACK FUNCTIONS FOR WHEN USER ADDS, REMOVES, & UPDATES A VISUAL RULE
     * UPDATES RULE WILL NEED TO PROPAGATE TO BEHAVIOR STATE
     *  */
    const mockData: IVisualRule[] = [
        {
            id: 'Machine temp',
            displayName: 'Machine temp',
            conditions: ['Badge', 'Mesh coloring']
        },
        {
            id: 'Machine health',
            displayName: 'Machine health',
            conditions: ['Mesh coloring']
        },
        {
            id: 'Machine active',
            displayName: 'Machine active',
            conditions: ['Mesh coloring']
        }
    ];
    const [ruleItems] = useState<IVisualRule[]>(mockData);
    const [
        isVisualRuleFormOpen,
        { toggle: toggleIsVisualRuleFormOpen }
    ] = useBoolean(false);
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const actionButtonStyles = getActionButtonStyles(theme);

    const { t } = useTranslation();
    const onAddRule = useCallback(() => {
        alert('** Visual Rule Form Appears ***');
    }, []);
    const onEditRule = useCallback(() => {
        alert('Edited a rule');
    }, []);
    const onRemoveRule = useCallback(() => {
        alert('Removed a rule');
    }, []);

    return (
        <div className={commonPanelStyles.formTabContents}>
            <Stack
                tokens={{ childrenGap: 8 }}
                className={commonPanelStyles.paddedLeftPanelBlock}
            >
                <Text className={commonPanelStyles.text}>
                    {t(LOC_KEYS.tabDescription)}
                </Text>
                {ruleItems.length ? (
                    <VisualRulesList
                        ruleItems={ruleItems}
                        onEditRule={onEditRule}
                        onRemoveRule={onRemoveRule}
                    />
                ) : (
                    <div className={commonPanelStyles.noDataText}>
                        {t(LOC_KEYS.noData)}
                    </div>
                )}
                <ActionButton
                    styles={actionButtonStyles}
                    text={t(LOC_KEYS.addButtonText)}
                    data-testid={'visualRuleFor-addRule'}
                    onClick={() => {
                        toggleIsVisualRuleFormOpen();
                    }}
                />
            </Stack>
            {isVisualRuleFormOpen && onAddRule()}
        </div>
    );
};
