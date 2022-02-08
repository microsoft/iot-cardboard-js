import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Intellisense } from '../../../../../../Components/AutoComplete/Intellisense';
import { VisualType } from '../../../../../../Models/Classes/3DVConfig';
import { BehaviorFormContext } from '../BehaviorsForm';

const BehaviorFormAlertsTab: React.FC = () => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    let colorAlertTriggerExpression = '';
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );
    if (colorChangeVisual) {
        colorAlertTriggerExpression = colorChangeVisual.color.expression;
    }

    return (
        <>
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t('3dSceneBuilder.behaviorTriggerLabel'),
                        multiline: colorAlertTriggerExpression.length > 50,
                        placeholder: t(
                            '3dSceneBuilder.behaviorTriggerPlaceholder'
                        )
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
                aliasNames={['LinkedTwin']}
                propertyNames={['$dtId', 'InFlow', 'OutFlow']}
            />
        </>
    );
};

export default BehaviorFormAlertsTab;
