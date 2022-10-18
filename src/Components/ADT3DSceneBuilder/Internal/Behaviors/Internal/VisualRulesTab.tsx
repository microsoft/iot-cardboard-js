import { Stack, useTheme, Text, ActionButton } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
    getActionButtonStyles,
    getLeftPanelStyles
} from '../../Shared/LeftPanel.styles';
import { VisualRulesList } from '../VisualRules/VisualRuleList';
import { IVisualRule } from '../VisualRules/VisualRules.types';
import { useBehaviorFormContext } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import {
    IBehavior,
    IExpressionRangeVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { BehaviorFormContextActionType } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';

//get an array of all the visual rules in the behavior
const getVisualRulesFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isVisualRule) || null;

const ROOT_LOC = '3dSceneBuilder.behaviorVisualRulesTab';
const LOC_KEYS = {
    addButtonText: `${ROOT_LOC}.addRuleButtonText`,
    noData: `${ROOT_LOC}.noData`,
    tabDescription: `${ROOT_LOC}.tabDescription`
};
export interface IVisualRuleProps {
    onEditRule: (ruleId: string) => void;
    onAddRule: () => void;
}
export const VisualRulesTab: React.FC<IVisualRuleProps> = ({
    onEditRule,
    onAddRule
}) => {
    //hooks
    const { t } = useTranslation();

    const {
        behaviorFormState,
        behaviorFormDispatch
    } = useBehaviorFormContext();

    //state
    const [ruleItems, setRuleItems] = useState<IVisualRule[]>([]);

    //callbacks
    const onRemoveRule = useCallback(
        (id: string) => {
            behaviorFormDispatch({
                type:
                    BehaviorFormContextActionType.FORM_BEHAVIOR_VISUAL_RULE_REMOVE,
                payload: {
                    visualRuleId: id
                }
            });
        },
        [behaviorFormDispatch]
    );

    //side effects

    // set the list IVisualRules that are going to be shown
    useEffect(() => {
        //get all the Visual Rules from behavior
        const visualRules: IExpressionRangeVisual[] =
            getVisualRulesFromBehavior(behaviorFormState.behaviorToEdit) || [];

        //transform from elements from IExpressionVisual => IVisualRule
        let rules: IVisualRule[] = [];
        if (visualRules.length > 0) {
            rules = visualRules.map((rule) => {
                return {
                    id: rule.id,
                    displayName: rule?.displayName
                        ? rule.displayName
                        : '(unlabeled)',
                    conditions: rule.valueRanges,
                    type: rule.expressionType
                };
            });
        }

        setRuleItems(rules);
    }, [behaviorFormState.behaviorToEdit.visuals]);

    //Styles
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const actionButtonStyles = getActionButtonStyles(theme);

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
                    onClick={onAddRule}
                />
            </Stack>
        </div>
    );
};
