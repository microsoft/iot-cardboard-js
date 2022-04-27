import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';

import { IValueWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import TwinPropertyDropown from '../../Internal/TwinPropertyDropdown';

const ValueWidgetBuilder: React.FC<IValueWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit } = useContext(SceneBuilderContext);

    useEffect(() => {
        const { displayName, valueExpression } = formData.widgetConfiguration;
        if (displayName && valueExpression) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData]);

    const onDisplayNameChange = useCallback(
        (_event, value: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.displayName = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const onPropertyChange = useCallback(
        (option: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.valueExpression = option; // TODO: Also update the type as necessary after we get the modelled property
                })
            );
        },
        [updateWidgetData, formData]
    );

    return (
        <>
            <TextField
                label={t('displayName')}
                value={formData.widgetConfiguration.displayName}
                onChange={onDisplayNameChange}
            />
            <TwinPropertyDropown // TODO: for now using existing TwinPropertyDropdown, replace this with ModelledPropertyBuilder
                behavior={behaviorToEdit}
                defaultSelectedKey={
                    formData.widgetConfiguration.valueExpression
                }
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
            />
        </>
    );
};

export default ValueWidgetBuilder;
