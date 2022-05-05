import { TextField, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IGaugeWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import ValueRangeBuilder from '../../../../../ValueRangeBuilder/ValueRangeBuilder';
import useValueRangeBuilder from '../../../../../../Models/Hooks/useValueRangeBuilder';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import { getWidgetFormStyles } from '../WidgetForm/WidgetForm.styles';
import ModelledPropertyBuilder from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import { PropertyExpression } from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

const GaugeWidgetBuilder: React.FC<IGaugeWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit, adapter, config, sceneId } = useContext(
        SceneBuilderContext
    );

    const {
        valueRangeBuilderState,
        valueRangeBuilderReducer
    } = useValueRangeBuilder({
        initialValueRanges: formData.widgetConfiguration.valueRanges,
        minRanges: 1,
        maxRanges: 3
    });

    useEffect(() => {
        const {
            valueExpression,
            widgetConfiguration: { label }
        } = formData;

        if (
            valueExpression?.length > 0 &&
            label?.length > 0 &&
            valueRangeBuilderState.areRangesValid
        ) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData, valueRangeBuilderState.areRangesValid]);

    useEffect(() => {
        updateWidgetData(
            produce(formData, (draft) => {
                draft.widgetConfiguration.valueRanges = deepCopy(
                    valueRangeBuilderState.valueRanges
                );
            })
        );
    }, [valueRangeBuilderState.valueRanges]);

    const onPropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.valueExpression = newPropertyExpression.expression;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);
    return (
        <div className={customStyles.gaugeWidgetFormContents}>
            <TextField
                data-testid={'widget-form-gauge-label-input'}
                label={t('label')}
                value={formData.widgetConfiguration.label}
                required
                onChange={(_ev, newVal) =>
                    updateWidgetData(
                        produce(formData, (draft) => {
                            draft.widgetConfiguration.label = newVal;
                        })
                    )
                }
            />
            <TextField
                data-testid={'widget-form-gauge-units-input'}
                label={t('3dSceneBuilder.unitOfMeasure')}
                value={formData.widgetConfiguration.units}
                onChange={(_ev, newVal) =>
                    updateWidgetData(
                        produce(formData, (draft) => {
                            draft.widgetConfiguration.units = newVal;
                        })
                    )
                }
            />
            <ModelledPropertyBuilder
                adapter={adapter}
                twinIdParams={{
                    behavior: behaviorToEdit,
                    config,
                    sceneId
                }}
                mode="TOGGLE"
                propertyExpression={{
                    expression: formData.valueExpression || ''
                }}
                onChange={onPropertyChange}
                allowedPropertyValueTypes={[
                    'double',
                    'float',
                    'integer',
                    'long'
                ]}
                dropdownTestId="widget-form-property-dropdown"
                required
            />
            <ValueRangeBuilder
                className={customStyles.rangeBuilderRoot}
                valueRangeBuilderReducer={valueRangeBuilderReducer}
            />
        </div>
    );
};

export default GaugeWidgetBuilder;
