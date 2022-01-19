import { ColorPicker, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBehavior, VisualType } from '../../../../Models/Classes/3DVConfig';

const BehaviorFormAlertsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}> = ({ behaviorToEdit, setBehaviorToEdit }) => {
    const { t } = useTranslation();

    let colorAlertTriggerExpression = '';
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );
    if (colorChangeVisual) {
        colorAlertTriggerExpression = colorChangeVisual.color.expression;
    }

    const [color, setColor] = useState('#FF0000');

    return (
        <>
            <TextField
                label={t('3dSceneBuilder.behaviorTriggerLabel')}
                multiline={colorAlertTriggerExpression.length > 50}
                onChange={(_e, newValue) => {
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
                value={colorAlertTriggerExpression}
                placeholder={t('3dSceneBuilder.behaviorTriggerPlaceholder')}
            />
            <ColorPicker
                alphaType={'none'}
                color={color}
                onChange={(_ev, color) => setColor(color.hex)}
            />
        </>
    );
};

export default BehaviorFormAlertsTab;
