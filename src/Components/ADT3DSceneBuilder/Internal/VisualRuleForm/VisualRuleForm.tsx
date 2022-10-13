import {
    classNamesFunction,
    DefaultButton,
    Label,
    PrimaryButton,
    Separator,
    Stack,
    styled,
    TextField,
    useTheme
} from '@fluentui/react';
import React, {
    useCallback,
    useContext,
    useReducer,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { getDefaultVisualRule } from '../../../../Models/Classes/3DVConfig';
import { useBehaviorFormContext } from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { IExpressionRangeVisual } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ModelledPropertyBuilder from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import TooltipCallout from '../../../TooltipCallout/TooltipCallout';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import {
    IVisualRuleFormReducerType,
    VisualRuleFormActionType
} from '../Behaviors/VisualRules/VisualRules.types';
import PanelFooter from '../Shared/PanelFooter';
import { getPanelFormStyles } from '../Shared/PanelForms.styles';
import {
    checkValidityMap,
    createValidityMap,
    FieldToValidate,
    IValidityState
} from '../Shared/SharedFormUtils';
import ConditionsList from './Internal/ConditionsList';
import { VisualRuleFormReducer } from './VisualRuleForm.state';
import { getStyles } from './VisualRuleForm.styles';
import {
    IVisualRuleFormProps,
    IVisualRuleFormStyles,
    IVisualRuleFormStylesProps
} from './VisualRuleForm.types';

const getClassNames = classNamesFunction<
    IVisualRuleFormStylesProps,
    IVisualRuleFormStyles
>();

const VisualRuleForm: React.FC<IVisualRuleFormProps> = (props) => {
    // Context
    const { behaviorFormState } = useBehaviorFormContext();

    // Props
    const {
        handleExpressionTextFieldEnabled,
        onCancelClick,
        onSaveClick,
        rootHeight,
        styles,
        visualRuleId
    } = props;

    // General constants
    const { t } = useTranslation();
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });
    const commonFormStyles = getPanelFormStyles(theme, rootHeight);

    // Refs
    // This combination of init function and useRef should replace a useEffect that runs onMount
    const getInitialVisualRule = (): IExpressionRangeVisual => {
        if (visualRuleId) {
            const selectedVisualRule = behaviorFormState.behaviorToEdit.visuals.find(
                (visual) => {
                    return (
                        visual.type === 'ExpressionRangeVisual' &&
                        visual.id === visualRuleId
                    );
                }
            ) as IExpressionRangeVisual;
            // If visual rule with that id is not found return default visual rule
            return selectedVisualRule
                ? selectedVisualRule
                : getDefaultVisualRule();
        } else {
            return getDefaultVisualRule();
        }
    };
    const initialVisualRule = useRef<IExpressionRangeVisual>(
        getInitialVisualRule()
    );

    // State
    const getInitialFieldValidityState = (): Map<string, IValidityState> => {
        const fieldsToValidate: FieldToValidate[] = [
            {
                key: 'displayName',
                defaultValidityState:
                    initialVisualRule.current.displayName &&
                    initialVisualRule.current.displayName.length
                        ? true
                        : false
            },
            {
                key: 'expression',
                defaultValidityState:
                    initialVisualRule.current.valueExpression.length > 0
                        ? true
                        : false
            }
        ];
        return createValidityMap(fieldsToValidate);
    };
    const [validityMap, setValidityMap] = useState(
        getInitialFieldValidityState()
    );

    // Reducer
    const [
        visualRuleFormState,
        visualRuleFormDispatch
    ] = useReducer<IVisualRuleFormReducerType>(VisualRuleFormReducer, {
        originalVisualRule: initialVisualRule.current,
        visualRuleToEdit: initialVisualRule.current,
        isDirty: false
    });

    // Contexts
    const {
        config,
        sceneId,
        adapter,
        state: { selectedElements, selectedBehavior }
    } = useContext(SceneBuilderContext);

    // Callbacks
    const onDisplayNameChange = useCallback(
        (
            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            name: string
        ) => {
            let isValid = false;
            if (name && name.length) {
                isValid = true;
            }
            setValidityMap((validityMap) => {
                validityMap.set('displayName', { isValid: isValid });
                return validityMap;
            });
            visualRuleFormDispatch({
                type:
                    VisualRuleFormActionType.FORM_VISUAL_RULE_DISPLAY_NAME_SET,
                payload: { name: name }
            });
        },
        []
    );

    const onPropertyChange = useCallback(
        (propertyExpression: PropertyExpression) => {
            let isValid = false;
            if (
                propertyExpression.expression &&
                propertyExpression.expression.length
            ) {
                isValid = true;
            }
            setValidityMap((validityMap) => {
                validityMap.set('expression', { isValid: isValid });
                return validityMap;
            });
            visualRuleFormDispatch({
                type: VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_SET,
                payload: { expression: propertyExpression.expression }
            });
        },
        []
    );

    const onInternalModeChanged = useCallback((internalMode) => {
        if (internalMode === 'INTELLISENSE') {
            visualRuleFormDispatch({
                type:
                    VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET,
                payload: { type: 'CategoricalValues' }
            });
            handleExpressionTextFieldEnabled(true);
        } else {
            visualRuleFormDispatch({
                type:
                    VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET,
                payload: { type: 'NumericRange' }
            });
            handleExpressionTextFieldEnabled(false);
        }
    }, []);

    const handleSaveClick = useCallback(() => {
        onSaveClick(visualRuleFormState.visualRuleToEdit);
    }, [visualRuleFormState.visualRuleToEdit]);

    const handleCancelClick = useCallback(() => {
        onCancelClick(visualRuleFormState.isDirty);
    }, [visualRuleFormState.isDirty]);

    const handleDeleteCondition = useCallback(
        (conditionId: string) => {
            visualRuleFormDispatch({
                type: VisualRuleFormActionType.FORM_CONDITION_REMOVE,
                payload: { conditionId: conditionId }
            });
        },
        [visualRuleFormDispatch]
    );

    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
                    <Stack tokens={{ childrenGap: 12 }}>
                        <div className={classNames.descriptionContainer}>
                            {t('3dSceneBuilder.visualRuleForm.formDescription')}
                        </div>
                        <TextField
                            label={t('displayName')}
                            value={
                                visualRuleFormState.visualRuleToEdit.displayName
                            }
                            required={true}
                            onChange={onDisplayNameChange}
                            styles={classNames.subComponentStyles.textField}
                        />
                        <ModelledPropertyBuilder
                            adapter={adapter}
                            twinIdParams={{
                                behavior: selectedBehavior,
                                config,
                                sceneId,
                                selectedElements
                            }}
                            mode={ModelledPropertyBuilderMode.TOGGLE}
                            propertyExpression={{
                                expression:
                                    visualRuleFormState.visualRuleToEdit
                                        .valueExpression
                            }}
                            onChange={onPropertyChange}
                            onInternalModeChanged={onInternalModeChanged}
                            required
                        />
                    </Stack>
                </div>
                <Separator />
                <div className={commonFormStyles.expandingSection}>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label styles={classNames.subComponentStyles.label}>
                            {t('3dSceneBuilder.conditions')}
                        </Label>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoContent'
                                ),
                                calloutContent: t(
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoContent'
                                )
                            }}
                            styles={
                                classNames.subComponentStyles.tooltipCallout
                            }
                        />
                    </Stack>
                    <ConditionsList
                        valueRanges={
                            visualRuleFormState.visualRuleToEdit.valueRanges
                        }
                        expressionType={
                            visualRuleFormState.visualRuleToEdit.expressionType
                        }
                        onDeleteCondition={handleDeleteCondition}
                        styles={classNames.subComponentStyles.conditionsList}
                    />
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    text={t('save')}
                    onClick={handleSaveClick}
                    disabled={!checkValidityMap(validityMap)}
                    styles={classNames.subComponentStyles.saveButton?.()}
                />
                <DefaultButton
                    text={t('cancel')}
                    onClick={handleCancelClick}
                    styles={classNames.subComponentStyles.cancelButton?.()}
                />
            </PanelFooter>
        </>
    );
};

export default styled<
    IVisualRuleFormProps,
    IVisualRuleFormStylesProps,
    IVisualRuleFormStyles
>(VisualRuleForm, getStyles);
