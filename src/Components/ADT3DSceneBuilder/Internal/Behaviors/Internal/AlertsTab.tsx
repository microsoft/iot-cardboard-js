// TODO SCHEMA MIGRATION - update Alerts tab to new schema & types
/*
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Intellisense } from '../../../../AutoComplete/Intellisense';
import { VisualType } from '../../../../../Models/Classes/3DVConfig';
import { primaryTwinName } from '../../../../../Models/Constants';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';

const AlertsTab: React.FC = () => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [propertyNames, setPropertyNames] = useState<string[]>(null);

    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );

    const colorAlertTriggerExpression =
        colorChangeVisual?.color?.expression || '';
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);

    if (!propertyNames) {
        adapter
            .getCommonTwinPropertiesForBehavior(sceneId, config, behaviorToEdit)
            .then((properties) => {
                setPropertyNames(properties);
            });
    }

    function getPropertyNames(twinId: string) {
        return twinId === primaryTwinName ? propertyNames : [];
    }

    return (
        <>
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t('3dSceneBuilder.behaviorTriggerLabel'),
                        multiline: colorAlertTriggerExpression.length > 40,
                        placeholder: t('3dSceneBuilder.expressionPlaceholder')
                    }
                }}
                onChange={(newValue) => {
                    setBehaviorToEdit(
                        produce((draft) => {
                            // Assuming only 1 color change visual per behavior
                            const colorChangeVisual = draft.visuals.find(
                                (visual) =>
                                    visual.type === VisualType.ColorChange
                            );
                            colorChangeVisual.color.expression = newValue;
                        })
                    );
                }}
                defaultValue={colorAlertTriggerExpression}
                aliasNames={[primaryTwinName]}
                getPropertyNames={getPropertyNames}
            />
        </>
    );
};

export default AlertsTab;
*/
