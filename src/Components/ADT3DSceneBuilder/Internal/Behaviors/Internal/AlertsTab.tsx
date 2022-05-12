import produce from 'immer';
import React, { useCallback, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IAlertVisual,
    IBehavior
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IStackTokens, Stack, Text, useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../Theming/Palettes';
import { defaultAlertVisual } from '../../../../../Models/Classes/3DVConfig';
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
    notice: `${ROOT_LOC}.notice`,
    notificationLabel: `${ROOT_LOC}.notificationLabel`,
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
    const alertVisualStateRef = useRef<IAlertVisual>(
        getAlertFromBehavior(behaviorToEdit) || defaultAlertVisual
    );

    const setProperty = useCallback(
        (propertyName: keyof IAlertVisual, value: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 alert visual per behavior
                    const alertVisual = getAlertFromBehavior(draft);

                    // If clearing out trigger expression
                    if (propertyName === 'triggerExpression' && value === '') {
                        // Remove visual from behavior
                        if (alertVisual) {
                            const avIdx = draft.visuals.indexOf(alertVisual);
                            draft.visuals.splice(avIdx, 1);

                            // Backup current state of alert visual form
                            alertVisualStateRef.current = deepCopy(alertVisual);
                            alertVisual.triggerExpression = '';
                        }
                    } else {
                        // Edit flow
                        if (alertVisual) {
                            alertVisual[propertyName] = value as any;
                        } else {
                            const alertVisual = alertVisualStateRef.current;
                            alertVisual[propertyName] = value as any;
                            draft.visuals.push(alertVisual);
                        }
                    }
                })
            );
        },
        [setBehaviorToEdit, alertVisualStateRef.current]
    );

    const onTriggerExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setProperty('triggerExpression', newPropertyExpression.expression),
        [setProperty]
    );

    const onLabelExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setProperty(
                'labelExpression',
                wrapTextInTemplateString(newPropertyExpression.expression)
            ),
        [setProperty]
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) => {
            setProperty('color', newValue.item);
        },
        [setProperty]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) => {
            setProperty('iconName', newValue.item);
        },
        [setProperty]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorToEdit);
    const color = alertVisual?.color;
    const icon = alertVisual?.iconName;
    const triggerExpression = alertVisual?.triggerExpression;
    const notificationExpression = alertVisual?.labelExpression;
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);

    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>{t(LOC_KEYS.notice)}</Text>
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
                    expression: triggerExpression || ''
                }}
                onChange={onTriggerExpressionChange}
                customLabel={t(LOC_KEYS.expressionLabel)}
                intellisensePlaceholder={t(LOC_KEYS.expressionPlaceholder)}
            />
            {alertVisual && (
                <>
                    <Stack tokens={sectionStackTokens} horizontal>
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
                        />
                    </Stack>
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
                        onChange={onLabelExpressionChange}
                        customLabel={t(LOC_KEYS.notificationLabel)}
                        intellisensePlaceholder={t(
                            LOC_KEYS.notificationPlaceholder
                        )}
                    />
                </>
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 8 };

export default AlertsTab;
