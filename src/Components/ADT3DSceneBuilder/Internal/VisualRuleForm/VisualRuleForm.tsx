import {
    classNamesFunction,
    DefaultButton,
    Dropdown,
    IDropdownOption,
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
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { getDefaultVisualRule } from '../../../../Models/Classes/3DVConfig';
import { DTDLPropertyIconographyMap } from '../../../../Models/Constants/Constants';
import { useBehaviorFormContext } from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import {
    IDTDLPropertyType,
    IExpressionRangeVisual,
    IValueRange
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ModelledPropertyBuilder from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    numericPropertyValueTypes,
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
    IValidityState,
    onRenderTypeOption,
    onRenderTypeTitle
} from '../Shared/SharedFormUtils';
import ConditionsList from './Internal/ConditionsList';
import { VisualRuleFormReducer } from './VisualRuleForm.state';
import { getStyles } from './VisualRuleForm.styles';
import {
    IVisualRuleFormProps,
    IVisualRuleFormStyles,
    IVisualRuleFormStylesProps
} from './VisualRuleForm.types';
import { isNumericType } from './VisualRuleFormUtility';

const getClassNames = classNamesFunction<
    IVisualRuleFormStylesProps,
    IVisualRuleFormStyles
>();

const INCLUDED_KEYS = [
    'boolean',
    'double',
    'enum',
    'float',
    'integer',
    'long',
    'string'
];

const VisualRuleForm: React.FC<IVisualRuleFormProps> = (props) => {
    // Context
    const { behaviorFormState } = useBehaviorFormContext();

    // Props
    const {
        handleExpressionTextFieldEnabled,
        isExpressionTextFieldEnabled,
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
    const typeOptions: Array<IDropdownOption> = useMemo(() => {
        const options = [];
        Object.keys(DTDLPropertyIconographyMap).forEach((mappingKey) => {
            if (INCLUDED_KEYS.includes(mappingKey)) {
                options.push({
                    key: `value-type-${DTDLPropertyIconographyMap[mappingKey].text}`,
                    text: DTDLPropertyIconographyMap[mappingKey].text,
                    data: {
                        icon: DTDLPropertyIconographyMap[mappingKey].icon
                    }
                });
            }
        });
        return options;
    }, []);

    // Refs
    const ignorePropertyChangeOnMount = useRef(true);
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
            },
            {
                key: 'conditions',
                defaultValidityState:
                    initialVisualRule.current.valueRanges &&
                    initialVisualRule.current.valueRanges.length > 0
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
    const getInitialConditionsHistoryMap = () => {
        const historyMap = new Map<string, IValueRange[]>();
        historyMap.set(
            initialVisualRule.current.valueRangeType,
            initialVisualRule.current.valueRanges
        );
        return historyMap;
    };
    const [
        visualRuleFormState,
        visualRuleFormDispatch
    ] = useReducer<IVisualRuleFormReducerType>(VisualRuleFormReducer, {
        conditionsHistoryMap: getInitialConditionsHistoryMap(),
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

    // Side-effects
    useEffect(() => {
        if (
            visualRuleFormState.visualRuleToEdit.valueRanges &&
            visualRuleFormState.visualRuleToEdit.valueRanges.length >= 1
        ) {
            setValidityMap((validityMap) => {
                validityMap.set('conditions', { isValid: true });
                return validityMap;
            });
        } else {
            setValidityMap((validityMap) => {
                validityMap.set('conditions', { isValid: false });
                return validityMap;
            });
        }
    }, [visualRuleFormState.visualRuleToEdit.valueRanges]);

    // Callbacks
    const onDisplayNameChange = useCallback(
        (
            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            name: string
        ) => {
            const isValid = name?.trim().length > 0;
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
            const isValid = propertyExpression.expression?.trim().length > 0;
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

    const onInternalModeChanged = useCallback(
        (internalMode) => {
            if (internalMode === 'INTELLISENSE') {
                visualRuleFormDispatch({
                    type:
                        VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET,
                    payload: { type: 'CategoricalValues' }
                });
                handleExpressionTextFieldEnabled(true);
            } else {
                // Check for property type not being numeric, reset property selection
                // exclude this from internal mode changed triggered on mount of component
                if (
                    !isNumericType(
                        visualRuleFormState.visualRuleToEdit.valueRangeType
                    ) &&
                    !ignorePropertyChangeOnMount.current
                ) {
                    visualRuleFormDispatch({
                        type:
                            VisualRuleFormActionType.RESET_VISUAL_RULE_EXPRESSION_AND_TYPE
                    });
                }

                visualRuleFormDispatch({
                    type:
                        VisualRuleFormActionType.FORM_VISUAL_RULE_EXPRESSION_TYPE_SET,
                    payload: { type: 'NumericRange' }
                });
                handleExpressionTextFieldEnabled(false);
            }
            // Once this was triggered on mount allow reset when mode changes from advanced -> simple
            ignorePropertyChangeOnMount.current = false;
        },
        [
            handleExpressionTextFieldEnabled,
            visualRuleFormState.visualRuleToEdit.valueRangeType
        ]
    );

    const handleSaveClick = useCallback(() => {
        onSaveClick(visualRuleFormState.visualRuleToEdit);
    }, [visualRuleFormState.visualRuleToEdit, onSaveClick]);

    const handleCancelClick = useCallback(() => {
        onCancelClick(visualRuleFormState.isDirty);
    }, [visualRuleFormState.isDirty, onCancelClick]);

    const handleDeleteCondition = useCallback(
        (conditionId: string) => {
            visualRuleFormDispatch({
                type: VisualRuleFormActionType.FORM_CONDITION_REMOVE,
                payload: { conditionId: conditionId }
            });
        },
        [visualRuleFormDispatch]
    );

    const handleSaveCondition = useCallback(
        (condition: IValueRange) => {
            visualRuleFormDispatch({
                type: VisualRuleFormActionType.FORM_CONDITION_ADD_OR_UPDATE,
                payload: {
                    condition: {
                        ...condition,
                        visual: {
                            ...condition.visual,
                            labelExpression: condition.visual.labelExpression.trim()
                        }
                    }
                }
            });
        },
        [visualRuleFormDispatch]
    );

    const handlePropertyTypeChange = useCallback(
        (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
            if (option) {
                // Update state with new type and values
                visualRuleFormDispatch({
                    type:
                        VisualRuleFormActionType.FORM_VISUAL_RULE_VALUE_RANGE_TYPE_SET,
                    payload: {
                        type: option.text as IDTDLPropertyType
                    }
                });
            }
        },
        []
    );

    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
                    <Stack tokens={{ childrenGap: 12 }}>
                        <div className={classNames.descriptionContainer}>
                            {t('3dSceneBuilder.visualRuleForm.formSubTitle')}
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
                            excludeDtid={true}
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
                            allowedPropertyValueTypes={
                                numericPropertyValueTypes
                            }
                            required
                        />
                        {isExpressionTextFieldEnabled && (
                            <Dropdown
                                required
                                placeholder={t(
                                    '3dSceneBuilder.visualRuleForm.typePlaceholder'
                                )}
                                label={t('type')}
                                selectedKey={`value-type-${
                                    visualRuleFormState.visualRuleToEdit
                                        .valueRangeType
                                        ? visualRuleFormState.visualRuleToEdit
                                              .valueRangeType
                                        : 'string'
                                }`}
                                onChange={handlePropertyTypeChange}
                                options={typeOptions}
                                onRenderOption={onRenderTypeOption}
                                onRenderTitle={onRenderTypeTitle}
                                styles={classNames.subComponentStyles.dropdown}
                            />
                        )}
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
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoIconText'
                                ),
                                calloutContent: t(
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoIconText'
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
                        valueRangeType={
                            visualRuleFormState.visualRuleToEdit.valueRangeType
                        }
                        expressionType={
                            visualRuleFormState.visualRuleToEdit.expressionType
                        }
                        onDeleteCondition={handleDeleteCondition}
                        onSaveCondition={handleSaveCondition}
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
