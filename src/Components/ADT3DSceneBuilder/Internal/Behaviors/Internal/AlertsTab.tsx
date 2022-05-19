import produce from 'immer';
import React, { useCallback, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IBehavior,
    IExpressionRangeVisual
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

const getAlertFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0] || null;

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
        behaviorToEdit,
        setBehaviorToEdit,
        adapter,
        config,
        sceneId,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);

    const alertVisualStateRef = useRef<IExpressionRangeVisual>(
        getAlertFromBehavior(behaviorToEdit) || getUIDDefaultAlertVisual()
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

    const onExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );

                    // If clearing out expression
                    if (newPropertyExpression.expression === '') {
                        // Remove visual from behavior
                        if (alertVisual) {
                            const avIdx = draft.visuals.indexOf(alertVisual);
                            draft.visuals.splice(avIdx, 1);

                            // Backup current state of alert visual form
                            alertVisualStateRef.current = deepCopy(alertVisual);
                            alertVisual.valueExpression = '';
                        }
                    } else {
                        alertVisual.valueExpression =
                            newPropertyExpression.expression;
                    }
                })
            ),
        [setBehaviorToEdit]
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.color = newValue.item;
                })
            ),
        [setBehaviorToEdit]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.iconName = newValue.item;
                })
            ),
        [setBehaviorToEdit]
    );

    const onNoteChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.labelExpression = wrapTextInTemplateString(
                        newPropertyExpression.expression
                    );
                })
            ),
        [setBehaviorToEdit]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorToEdit);
    const color = alertVisual?.valueRanges?.[0]?.visual?.color;
    const icon = alertVisual?.valueRanges?.[0]?.visual?.iconName;
    const notificationExpression =
        alertVisual?.valueRanges?.[0]?.visual?.labelExpression;
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
                    behavior: behaviorToEdit,
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
                                behavior: behaviorToEdit,
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
                                text: t(LOC_KEYS.notificationLabelTooltip)
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
