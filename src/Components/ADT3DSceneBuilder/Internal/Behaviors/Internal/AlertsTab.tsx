import produce from 'immer';
import React, { useCallback, useContext, useState } from 'react';
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
import ColorSelectButton from '../../../../ColorSelectButton/ColorSelectButton';
import { defaultSwatchColors } from '../../../../../Theming/Palettes';
import { defaultAlertVisual } from '../../../../../Models/Classes/3DVConfig';
import { deepCopy } from '../../../../../Models/Services/Utils';

const getAlertFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorAlertForm';
const LOC_KEYS = {
    colorPickerLabel: `${ROOT_LOC}.colorPickerLabel`,
    expressionLabel: `${ROOT_LOC}.expressionLabel`,
    expressionPlaceholder: `${ROOT_LOC}.expressionPlaceholder`,
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
                    // Edit flow
                    if (alertVisual) {
                        alertVisual[propertyName] = value as any;
                    } else {
                        const alertVisual = deepCopy(defaultAlertVisual);
                        alertVisual[propertyName] = value as any;
                        draft.visuals.push(alertVisual);
                    }
                })
            );
        },
        [setBehaviorToEdit]
    );

    const onExpressionChange = useCallback(
        (newValue: string) => {
            setProperty('triggerExpression', newValue);
        },
        [setProperty]
    );

    const onColorChange = useCallback(
        (newValue: string) => {
            setProperty('color', newValue);
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
    const colorChangeVisual =
        getAlertFromBehavior(behaviorToEdit) || defaultAlertVisual;
    const color = colorChangeVisual?.color || defaultSwatchColors[0].color;
    const expression = colorChangeVisual?.triggerExpression;
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
                        multiline: expression.length > 40,
                        placeholder: t(LOC_KEYS.expressionPlaceholder)
                    }
                }}
                onChange={onExpressionChange}
                defaultValue={expression}
                aliasNames={[linkedTwinName]}
                getPropertyNames={getPropertyNames}
            />
            <ColorSelectButton
                buttonColor={color}
                colorSwatch={defaultSwatchColors}
                label={t(LOC_KEYS.colorPickerLabel)}
                onChangeSwatchColor={onColorChange}
            />
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
                value={colorChangeVisual.labelExpression}
            />
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default AlertsTab;
