import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Intellisense } from '../../../../AutoComplete/Intellisense';
import {
    VisualType,
    DatasourceType
} from '../../../../../Models/Classes/3DVConfig';
import { linkedTwinName } from '../../../../../Models/Constants';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';
import { IAlertVisual } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IStackTokens,
    Stack,
    Text,
    TextField,
    useTheme
} from '@fluentui/react';

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

    // we only grab the first alert in the collection
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.Alert
    ) as IAlertVisual;

    const colorAlertTriggerExpression =
        colorChangeVisual?.triggerExpression || '';
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
                        multiline: colorAlertTriggerExpression.length > 40,
                        placeholder: t(LOC_KEYS.expressionPlaceholder)
                    }
                }}
                onChange={(newValue) => {
                    setBehaviorToEdit(
                        produce((draft) => {
                            // Assuming only 1 color change visual per behavior
                            const colorChangeVisual = draft.visuals.find(
                                (visual) => visual.type === VisualType.Alert
                            ) as IAlertVisual;
                            colorChangeVisual.triggerExpression = newValue;
                        })
                    );
                }}
                defaultValue={colorAlertTriggerExpression}
                aliasNames={[linkedTwinName]}
                getPropertyNames={getPropertyNames}
            />
            {/* TO DO: Implement for real */}
            <Text>{t(LOC_KEYS.colorPickerLabel)}</Text>
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: 'red',
                    border: `1px solid ${theme.semanticColors.inputBorder}`,
                    borderRadius: 4,
                    display: 'flex',
                    fontSize: 12,
                    height: 32,
                    padding: 4,
                    width: '100%'
                }}
            >
                To be implemented
            </div>
            <TextField
                label={t(LOC_KEYS.notificationLabel)}
                placeholder={t(LOC_KEYS.notificationPlaceholder)}
                multiline
                rows={3}
                disabled
            />
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default AlertsTab;
