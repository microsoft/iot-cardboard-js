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
import { defaultVisualRule } from '../../../../Models/Classes/3DVConfig';
import { VisualRuleFormMode } from '../../../../Models/Constants/Enums';
import { useBehaviorFormContext } from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';
import { deepCopy } from '../../../../Models/Services/Utils';
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
    ValidityMapType
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
    const {
        behaviorFormState,
        behaviorFormDispatch
    } = useBehaviorFormContext();

    // Props
    const { rootHeight, styles, visualRuleId } = props;

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
                    visual.type === 'ExpressionRangeVisual' &&
                        visual.id === visualRuleId;
                }
            ) as IExpressionRangeVisual;
            // If visual rule with that id is not found return default visual rule
            return selectedVisualRule ? selectedVisualRule : defaultVisualRule;
        } else {
            return defaultVisualRule;
        }
    };
    const initialVisualRule = useRef<IExpressionRangeVisual>(
        getInitialVisualRule()
    );

    // State
    const getInitialFieldValidityState = (): ValidityMapType => {
        const fieldsToValidate: FieldToValidate[] = [
            {
                key: 'displayName',
                defaultValue: initialVisualRule.current.displayName
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
        setVisualRuleFormMode,
        state: { selectedElements, selectedBehavior }
    } = useContext(SceneBuilderContext);

    const onDisplayNameChange = useCallback(
        (
            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            name: string
        ) => {
            const validityMapCopy = deepCopy(validityMap);
            if (name.length) {
                validityMapCopy.set('displayName', { isValid: true });
                setValidityMap(validityMapCopy);
                visualRuleFormDispatch({
                    type:
                        VisualRuleFormActionType.FORM_VISUAL_RULE_DISPLAY_NAME_SET,
                    payload: { name: name }
                });
            } else {
                validityMapCopy.set('displayName', { isValid: false });
                setValidityMap(validityMapCopy);
                visualRuleFormDispatch({
                    type:
                        VisualRuleFormActionType.FORM_VISUAL_RULE_DISPLAY_NAME_SET,
                    payload: { name: name }
                });
            }
        },
        []
    );

    const onPropertyChange = useCallback(
        (propertyExpression: PropertyExpression) => {
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
        } else {
            visualRuleFormDispatch({
                type:
                    VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET,
                payload: { type: 'NumericRange' }
            });
        }
    }, []);

    const onSaveClick = useCallback(() => {
        behaviorFormDispatch({
            type:
                BehaviorFormContextActionType.FORM_BEHAVIOR_VISUAL_RULE_ADD_OR_UPDATE,
            payload: { visualRule: visualRuleFormState.visualRuleToEdit }
        });
        setVisualRuleFormMode(VisualRuleFormMode.Inactive);
    }, []);

    const onCancelClick = useCallback(() => {
        setVisualRuleFormMode(VisualRuleFormMode.Inactive);
    }, []);

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
                                expression: ''
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
                        styles={classNames.subComponentStyles.conditionsList}
                    />
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    text={t('save')}
                    onClick={onSaveClick}
                    disabled={!checkValidityMap(validityMap)}
                    styles={classNames.subComponentStyles.saveButton?.()}
                />
                <DefaultButton
                    text={t('cancel')}
                    onClick={onCancelClick}
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
