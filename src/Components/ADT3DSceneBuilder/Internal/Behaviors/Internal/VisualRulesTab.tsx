import { Stack, useTheme, Text, ActionButton } from '@fluentui/react';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

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
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { VisualRuleFormMode } from '../../../../../Models/Constants';
import VisualRuleForm from '../../VisualRuleForm/VisualRuleForm';
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
export const VisualRulesTab: React.FC = () => {
    //hooks
    const { t } = useTranslation();

    const {
        behaviorFormState,
        behaviorFormDispatch
    } = useBehaviorFormContext();
    const { visualRuleFormMode, setVisualRuleFormMode } = useContext(
        SceneBuilderContext
    );

    //state
    const [ruleItems, setRuleItems] = useState<IVisualRule[]>([]);
    const [
        isPropertyTypeDropdownEnabled,
        setisPropertyTypeDropdownEnabled
    ] = useState(false);

    const isVisualRulesFormActive =
        visualRuleFormMode !== VisualRuleFormMode.Inactive;
    const formHeaderHeight = isVisualRulesFormActive
        ? isPropertyTypeDropdownEnabled
            ? 370
            : 268
        : 168;

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

    const onEditRule = useCallback(() => {
        setVisualRuleFormMode(VisualRuleFormMode.EditVisualRule);
    }, []);

    //side effects

    //get all the Visual Rules from behavior
    const visualRules: IExpressionRangeVisual[] = useMemo(() => {
        return (
            getVisualRulesFromBehavior(behaviorFormState.behaviorToEdit) || []
        );
    }, [behaviorFormState.behaviorToEdit]);

    //transform from elements from IExpressionVisual => IVisualRule
    const getVisualList = () => {
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
        return rules;
    };

    // set the list IVisualRules that are going to be shown
    useEffect(() => {
        setRuleItems(getVisualList());
    }, [behaviorFormState.behaviorToEdit.visuals]);

    const handlePropertyTypeDropdownEnabled = useCallback(
        (isEnabled: boolean) => {
            setisPropertyTypeDropdownEnabled(isEnabled);
        },
        [setisPropertyTypeDropdownEnabled]
    );

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
                    onClick={() => {
                        setVisualRuleFormMode(
                            VisualRuleFormMode.CreateVisualRule
                        );
                    }}
                />
            </Stack>
            {visualRuleFormMode !== 'Inactive' && (
                <VisualRuleForm
                    setPropertyTypeDropdownEnabled={
                        handlePropertyTypeDropdownEnabled
                    }
                    isPropertyTypeDropdownEnabled={
                        isPropertyTypeDropdownEnabled
                    }
                    rootHeight={formHeaderHeight}
                />
            )}
        </div>
    );
};
