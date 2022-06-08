import React, { useCallback, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IBehavior,
    IExpressionRangeVisual,
    IValueRangeVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { FontSizes, Stack, Text, useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../Theming/Palettes';
import { getUIDDefaultAlertVisual } from '../../../../../Models/Classes/3DVConfig';
import {
    wrapTextInTemplateString,
    deepCopy,
    stripTemplateStringsFromText
} from '../../../../../Models/Services/Utils';
import ColorPicker from '../../../../Pickers/ColorSelectButton/ColorPicker';
import { IPickerOption } from '../../../../Pickers/Internal/Picker.base.types';
import IconPicker from '../../../../Pickers/IconSelectButton/IconPicker';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import ModelledPropertyBuilder from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { useBehaviorFormContext } from './BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from './BehaviorFormContext/BehaviorFormContext.types';

// NOTE: the copy is created to avoid accidental updates to the object held by the reducer
const getAlertFromBehavior = (behavior: IBehavior) =>
    deepCopy(behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0]) ||
    null;
const getValueRangeVisualFromAlert = (visual: IExpressionRangeVisual) =>
    deepCopy(visual?.valueRanges?.[0]?.visual) || null;

const ROOT_LOC = '3dSceneBuilder.behaviorAlertForm';
const LOC_KEYS = {
    colorPickerLabel: `${ROOT_LOC}.colorPickerLabel`,
    expressionLabel: `${ROOT_LOC}.expressionLabel`,
    expressionPlaceholder: `${ROOT_LOC}.expressionPlaceholder`,
    iconPickerLabel: `${ROOT_LOC}.iconPickerLabel`,
    tabDescription: `${ROOT_LOC}.tabDescription`,
    notificationLabel: `${ROOT_LOC}.notificationLabel`,
    notificationLabelDescription: `${ROOT_LOC}.notificationLabelDescriptionPart1`,
    notificationLabelDescriptionExample: `${ROOT_LOC}.notificationLabelDescriptionPart2`,
    notificationLabelTooltip: `${ROOT_LOC}.notificationLabelTooltip`,
    notificationPlaceholder: `${ROOT_LOC}.notificationPlaceholder`
};

const AlertsTab: React.FC = () => {
    const { t } = useTranslation();
    const {
        adapter,
        config,
        sceneId,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);
    const {
        behaviorFormDispatch,
        behaviorFormState
    } = useBehaviorFormContext();

    const alertVisualStateRef = useRef<IExpressionRangeVisual>(
        getAlertFromBehavior(behaviorFormState.behaviorToEdit) ||
            getUIDDefaultAlertVisual()
    );

    const getAndCreateIfNotExistsAlertVisual = (draft: IBehavior) => {
        // Assuming only 1 alert visual per behavior
        const alertVisual = getAlertFromBehavior(draft);

        if (alertVisual) {
            return alertVisual;
        } else {
            const alertVisual = alertVisualStateRef.current;
            draft.visuals.push(alertVisual);
            return alertVisual;
        }
    };

    const setValueRangeProperty = useCallback(
        (propertyName: keyof IValueRangeVisual, value: string) => {
            const alertVisual = getAndCreateIfNotExistsAlertVisual(
                behaviorFormState.behaviorToEdit
            );
            // Edit flow
            if (!alertVisual) {
                return;
            }
            const valueRangeVisual = getValueRangeVisualFromAlert(alertVisual);
            if (!valueRangeVisual) {
                return;
            }

            // set the value
            valueRangeVisual[propertyName] = value as any;

            behaviorFormDispatch({
                type:
                    BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                payload: {
                    visual: alertVisual
                }
            });
            // check form validity
            // validateForm(alertVisual);
        },
        [behaviorFormDispatch, behaviorFormState.behaviorToEdit]
    );

    const onExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            const alertVisual = getAndCreateIfNotExistsAlertVisual(
                behaviorFormState.behaviorToEdit
            );

            // If clearing out expression
            if (newPropertyExpression.expression === '' && alertVisual) {
                // Backup current state of alert visual form
                alertVisualStateRef.current = deepCopy(alertVisual);
                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE
                });
            } else {
                alertVisual.valueExpression = newPropertyExpression.expression;
                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                    payload: {
                        visual: alertVisual
                    }
                });
            }
        },
        [behaviorFormDispatch, behaviorFormState.behaviorToEdit]
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) =>
            setValueRangeProperty('color', newValue.item),
        [setValueRangeProperty]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) =>
            setValueRangeProperty('iconName', newValue.item),
        [setValueRangeProperty]
    );

    const onNoteChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setValueRangeProperty(
                'labelExpression',
                wrapTextInTemplateString(newPropertyExpression.expression)
            ),
        [setValueRangeProperty]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorFormState.behaviorToEdit);
    const color = getValueRangeVisualFromAlert(alertVisual)?.color;
    const icon = getValueRangeVisualFromAlert(alertVisual)?.iconName;
    const notificationExpression = getValueRangeVisualFromAlert(alertVisual)
        ?.labelExpression;
    const expression = alertVisual?.valueExpression;
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <Text className={commonPanelStyles.text}>
                {t(LOC_KEYS.tabDescription)}
            </Text>
            <ModelledPropertyBuilder
                adapter={adapter}
                twinIdParams={{
                    behavior: behaviorFormState.behaviorToEdit,
                    config,
                    sceneId,
                    selectedElements
                }}
                mode={ModelledPropertyBuilderMode.INTELLISENSE}
                propertyExpression={{
                    expression: expression || ''
                }}
                onChange={onExpressionChange}
                customLabel={t(LOC_KEYS.expressionLabel)}
                intellisensePlaceholder={t(LOC_KEYS.expressionPlaceholder)}
            />
            {alertVisual && (
                <>
                    <Stack tokens={{ childrenGap: 12 }} horizontal>
                        <IconPicker
                            selectedItem={icon}
                            items={defaultSwatchIcons}
                            label={t(LOC_KEYS.iconPickerLabel)}
                            onChangeItem={onIconChange}
                        />
                        <ColorPicker
                            selectedItem={color}
                            items={defaultSwatchColors}
                            label={t(LOC_KEYS.colorPickerLabel)}
                            onChangeItem={onColorChange}
                            styles={{
                                // match the icon picker
                                button: {
                                    height: 32,
                                    width: 32
                                }
                            }}
                        />
                    </Stack>
                    <Stack tokens={{ childrenGap: 4 }}>
                        <ModelledPropertyBuilder
                            adapter={adapter}
                            twinIdParams={{
                                behavior: behaviorFormState.behaviorToEdit,
                                config,
                                sceneId,
                                selectedElements
                            }}
                            mode={ModelledPropertyBuilderMode.INTELLISENSE}
                            propertyExpression={{
                                expression:
                                    stripTemplateStringsFromText(
                                        notificationExpression
                                    ) || ''
                            }}
                            onChange={onNoteChange}
                            customLabel={t(LOC_KEYS.notificationLabel)}
                            customLabelTooltip={{
                                buttonAriaLabel: t(
                                    LOC_KEYS.notificationLabelTooltip
                                ),
                                calloutContent: t(
                                    LOC_KEYS.notificationLabelTooltip
                                )
                            }}
                            intellisensePlaceholder={t(
                                LOC_KEYS.notificationPlaceholder
                            )}
                        />
                        <Text styles={{ root: { fontSize: FontSizes.small } }}>
                            {t(LOC_KEYS.notificationLabelDescription)}{' '}
                            <i>
                                {t(
                                    LOC_KEYS.notificationLabelDescriptionExample
                                )}
                            </i>
                        </Text>
                    </Stack>
                </>
            )}
        </Stack>
    );
};

export default AlertsTab;
