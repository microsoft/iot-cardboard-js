import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import {
    ActionItemKey,
    ConditionCalloutActionType,
    ConditionCalloutReducerType,
    ConditionValidityMap,
    IConditionsCalloutProps,
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
} from './ConditionsCallout.types';
import { getStyles } from './ConditionsCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    Stack,
    DirectionalHint,
    TextField,
    PrimaryButton,
    DefaultButton
} from '@fluentui/react';
import { ConditionSummary } from './ConditionSummary';
import { ActionItem } from './ActionItem';
import { ConditionCalloutReducer } from './ConditionsCallout.state';
import { IDTDLPropertyType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useTranslation } from 'react-i18next';
import { areRangesValid, checkValidity } from './ConditionCalloutUtility';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import { CalloutInfoType } from '../ConditionsList.types';

const getClassNames = classNamesFunction<
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
>();

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    addCondition: `${ROOT_LOC}.addCondition`,
    editCondition: `${ROOT_LOC}.editCondition`,
    labelField: `${ROOT_LOC}.labelField`
};

const ConditionsCallout: React.FC<IConditionsCalloutProps> = (props) => {
    const {
        calloutType,
        isOpen,
        onDismiss,
        onSave,
        target,
        styles,
        valueRange,
        valueRangeType
    } = props;

    // state

    // refs
    const validityMap = useRef<ConditionValidityMap>({
        label: !!valueRange.visual.labelExpression?.length,
        ranges: areRangesValid(valueRange.values, valueRangeType)
    });

    // hooks
    const { t } = useTranslation();
    const [
        conditionCalloutState,
        conditionCalloutDispatch
    ] = useReducer<ConditionCalloutReducerType>(ConditionCalloutReducer, {
        conditionToEdit: valueRange,
        originalCondition: valueRange,
        isDirty: false
    });

    // side-effects
    useEffect(() => {
        // RESET CONDITION IN STATE AND VALIDITY MAP
        conditionCalloutDispatch({
            type: ConditionCalloutActionType.RESET_CONDITION,
            payload: { valueRange: valueRange }
        });
        validityMap.current = {
            label: !!valueRange.visual.labelExpression?.length,
            ranges: areRangesValid(valueRange.values, valueRangeType)
        };
    }, [valueRange, valueRangeType]);

    // callbacks
    const onLabelChange = useCallback(
        (
            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            newValue?: string
        ) => {
            if (newValue) {
                validityMap.current.label = true;
            } else {
                validityMap.current.label = false;
            }
            conditionCalloutDispatch({
                type: ConditionCalloutActionType.FORM_CONDITION_LABEL_SET,
                payload: { label: newValue }
            });
        },
        [conditionCalloutDispatch]
    );

    const onValuesChange = useCallback(
        (
            valueType: IDTDLPropertyType,
            newValues: unknown[],
            index?: number
        ) => {
            if (valueType === 'boolean' || valueType === 'string') {
                if (newValues.length) {
                    validityMap.current.ranges = true;
                } else {
                    validityMap.current.ranges = false;
                }
                conditionCalloutDispatch({
                    type: ConditionCalloutActionType.FORM_CONDITION_VALUES_SET,
                    payload: { values: newValues }
                });
            } else {
                const rangeValues = conditionCalloutState.conditionToEdit.values
                    ? deepCopy(conditionCalloutState.conditionToEdit.values)
                    : [0, 0];
                // Values
                rangeValues[index] = newValues[0];
                validityMap.current.ranges = areRangesValid(
                    rangeValues,
                    valueRangeType
                );
                conditionCalloutDispatch({
                    type: ConditionCalloutActionType.FORM_CONDITION_VALUES_SET,
                    payload: { values: rangeValues }
                });
            }
        },
        [conditionCalloutState.conditionToEdit.values, valueRangeType]
    );

    const onActionValueChange = useCallback(
        (key: ActionItemKey, value: string) => {
            if (key === 'color') {
                conditionCalloutDispatch({
                    type: ConditionCalloutActionType.FORM_CONDITION_COLOR_SET,
                    payload: { color: value }
                });
            } else {
                conditionCalloutDispatch({
                    type: ConditionCalloutActionType.FORM_CONDITION_ICON_SET,
                    payload: { iconName: value }
                });
            }
        },
        []
    );

    const handleSaveClick = useCallback(() => {
        onSave(conditionCalloutState.conditionToEdit);
        onDismiss();
    }, [onDismiss, onSave, conditionCalloutState.conditionToEdit]);

    const handleCancelClick = useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <>
            {isOpen && (
                <Callout
                    target={target}
                    styles={classNames.subComponentStyles.callout}
                    onDismiss={onDismiss}
                    directionalHint={DirectionalHint.rightCenter}
                >
                    <Stack tokens={{ childrenGap: 8 }}>
                        {calloutType === CalloutInfoType.create ? (
                            <span>{t(LOC_KEYS.addCondition)}</span>
                        ) : (
                            <span>{t(LOC_KEYS.editCondition)}</span>
                        )}
                        <TextField
                            value={
                                conditionCalloutState.conditionToEdit.visual
                                    ?.labelExpression
                                    ? conditionCalloutState.conditionToEdit
                                          .visual?.labelExpression
                                    : ''
                            }
                            onChange={onLabelChange}
                            label={t(LOC_KEYS.labelField)}
                            required={true}
                        />
                        <ConditionSummary
                            onChangeValues={onValuesChange}
                            currentValues={
                                conditionCalloutState.conditionToEdit?.values
                            }
                            conditionType={valueRangeType}
                            areValuesValid={validityMap.current.ranges}
                        />
                        <ActionItem
                            setActionSelectedValue={onActionValueChange}
                            color={
                                conditionCalloutState.conditionToEdit.visual
                                    .color
                            }
                            iconName={
                                conditionCalloutState.conditionToEdit.visual
                                    .iconName
                            }
                        />
                        <div className={classNames.footer}>
                            <Stack
                                horizontal={true}
                                horizontalAlign={'end'}
                                tokens={{ childrenGap: 4 }}
                            >
                                <PrimaryButton
                                    text={t('save')}
                                    onClick={handleSaveClick}
                                    disabled={
                                        !checkValidity(validityMap.current)
                                    }
                                    styles={classNames.subComponentStyles.saveButton?.()}
                                />
                                <DefaultButton
                                    text={t('cancel')}
                                    onClick={handleCancelClick}
                                    styles={classNames.subComponentStyles.cancelButton?.()}
                                />
                            </Stack>
                        </div>
                    </Stack>
                </Callout>
            )}
        </>
    );
};

export default styled<
    IConditionsCalloutProps,
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
>(ConditionsCallout, getStyles);
