import produce from 'immer';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Intellisense } from '../../../../AutoComplete/Intellisense';
import { linkedTwinName } from '../../../../../Models/Constants';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    IAlertVisual,
    IBehavior
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IStackTokens,
    Stack,
    Text,
    TextField,
    useTheme
} from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../Theming/Palettes';
import { defaultAlertVisual } from '../../../../../Models/Classes/3DVConfig';
import { deepCopy } from '../../../../../Models/Services/Utils';
import ColorPicker from '../../../../Pickers/ColorSelectButton/ColorPicker';
import { IPickerOption } from '../../../../Pickers/Internal/Picker.base.types';
import IconPicker from '../../../../Pickers/IconSelectButton/IconPicker';

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
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [propertyNames, setPropertyNames] = useState<string[]>(null);
    const alertVisualStateRef = useRef<IAlertVisual>(
        getAlertFromBehavior(behaviorToEdit) || defaultAlertVisual
    );

    const { config, sceneId, adapter } = useContext(SceneBuilderContext);

    if (!propertyNames) {
        adapter
            .getCommonTwinPropertiesForBehavior(sceneId, config, behaviorToEdit)
            .then((properties) => {
                setPropertyNames(properties);
            });
    }

    function getPropertyNames(twinId: string) {
        return twinId === linkedTwinName ? propertyNames : [];
    }

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

    const onExpressionChange = useCallback(
        (newValue: string) => {
            setProperty('triggerExpression', newValue);
        },
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

    const onNoteChange = useCallback(
        (_e: any, newValue: string) => {
            setProperty('labelExpression', newValue);
        },
        [setProperty]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorToEdit);
    const color = alertVisual?.color;
    const icon = alertVisual?.iconName;
    const expression = alertVisual?.triggerExpression;
    const theme = useTheme();
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t(LOC_KEYS.expressionLabel),
                        multiline: expression?.length > 40,
                        placeholder: t(LOC_KEYS.expressionPlaceholder)
                    }
                }}
                onChange={onExpressionChange}
                defaultValue={expression}
                aliasNames={[linkedTwinName]}
                getPropertyNames={getPropertyNames}
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
                    <TextField
                        label={t(LOC_KEYS.notificationLabel)}
                        placeholder={t(LOC_KEYS.notificationPlaceholder)}
                        multiline
                        onChange={onNoteChange}
                        rows={3}
                        styles={{
                            root: {
                                marginBottom: 4,
                                paddingBottom: 4
                            }
                        }}
                        value={alertVisual.labelExpression}
                    />
                </>
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default AlertsTab;
