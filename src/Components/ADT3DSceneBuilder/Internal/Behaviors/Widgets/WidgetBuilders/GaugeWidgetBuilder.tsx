import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { linkedTwinName } from '../../../../../../Models/Constants';
import { Intellisense } from '../../../../../../Components/AutoComplete/Intellisense';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import { IWidgetBuilderFormDataProps } from '../../../../ADT3DSceneBuilder.types';
import ValueRangeBuilder from '../../../../../ValueRangeBuilder/ValueRangeBuilder';
import { IValueRangeBuilderHandle } from '../../../../../ValueRangeBuilder/ValueRangeBuilder.types';

const GaugeWidgetBuilder: React.FC<IWidgetBuilderFormDataProps> = ({
    formData,
    setFormData,
    behaviorToEdit,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();
    const [propertyNames, setPropertyNames] = useState<string[]>(null);
    const valueRangeBuilderHandleRef = useRef<IValueRangeBuilderHandle>(null);
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [areValueRangesValid, setAreValueRangesValid] = useState(true);

    useEffect(() => {
        if (!propertyNames) {
            adapter
                .getCommonTwinPropertiesForBehavior(
                    sceneId,
                    config,
                    behaviorToEdit
                )
                .then((properties) => {
                    setPropertyNames(properties);
                });
        }
    }, [sceneId, config, behaviorToEdit]);

    function getPropertyNames(twinId: string) {
        return twinId === linkedTwinName ? propertyNames : [];
    }

    useEffect(() => {
        // If ranges valid, update form data
        if (areValueRangesValid) {
            setFormData(
                produce((draft) => {
                    draft.widgetConfiguration.valueRanges = valueRangeBuilderHandleRef.current.getValueRanges();
                })
            );
        }
    }, [areValueRangesValid]);

    useEffect(() => {
        const {
            valueExpression,
            widgetConfiguration: { label }
        } = formData;

        if (
            valueExpression?.length > 0 &&
            label?.length > 0 &&
            areValueRangesValid
        ) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData, areValueRangesValid]);

    return (
        <>
            <TextField
                label={t('label')}
                value={formData.widgetConfiguration.label}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce((draft) => {
                            draft.widgetConfiguration.label = newVal;
                        })
                    )
                }
            />
            <TextField
                label={t('3dSceneBuilder.unitOfMeasure')}
                value={formData.widgetConfiguration.units}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce((draft) => {
                            draft.widgetConfiguration.units = newVal;
                        })
                    )
                }
            />
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t('3dSceneBuilder.expression'),
                        placeholder: t('3dSceneBuilder.expressionPlaceholder'),
                        multiline: formData.valueExpression.length > 40
                    }
                }}
                defaultValue={formData.valueExpression}
                onChange={(newVal) => {
                    setFormData(
                        produce((draft) => {
                            draft.valueExpression = newVal;
                        })
                    );
                }}
                aliasNames={[linkedTwinName]}
                getPropertyNames={getPropertyNames}
            />
            <ValueRangeBuilder
                initialValueRanges={formData.widgetConfiguration.valueRanges}
                maxRanges={3}
                minRanges={1}
                ref={valueRangeBuilderHandleRef}
                setAreRangesValid={setAreValueRangesValid}
            />
        </>
    );
};

export default GaugeWidgetBuilder;
