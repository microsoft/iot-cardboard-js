import { TextField, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    intellisenseMultilineBreakpoint,
    linkedTwinName
} from '../../../../../../Models/Constants';
import { Intellisense } from '../../../../../../Components/AutoComplete/Intellisense';
import { IGaugeWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import ValueRangeBuilder from '../../../../../ValueRangeBuilder/ValueRangeBuilder';
import { getWidgetFormStyles } from '../WidgetForm.styles';

const GaugeWidgetBuilder: React.FC<IGaugeWidgetBuilderProps> = ({
    formData,
    setFormData,
    setIsWidgetConfigValid,
    valueRangeRef,
    getIntellisensePropertyNames
}) => {
    const { t } = useTranslation();
    const [areValueRangesValid, setAreValueRangesValid] = useState(true);

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

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);

    return (
        <div className={customStyles.gaugeWidgetFormContents}>
            <TextField
                data-testid={'widget-form-gauge-label-input'}
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
                data-testid={'widget-form-gauge-units-input'}
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
                        placeholder: t(
                            '3dSceneBuilder.numericExpressionPlaceholder'
                        ),
                        multiline:
                            formData.valueExpression.length >
                            intellisenseMultilineBreakpoint
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
                getPropertyNames={getIntellisensePropertyNames}
            />
            <ValueRangeBuilder
                className={customStyles.rangeBuilderRoot}
                initialValueRanges={formData.widgetConfiguration.valueRanges}
                maxRanges={3}
                minRanges={1}
                ref={valueRangeRef}
                setAreRangesValid={setAreValueRangesValid}
            />
        </div>
    );
};

export default GaugeWidgetBuilder;
