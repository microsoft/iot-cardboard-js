import { TextField, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IGaugeWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import ValueRangeBuilder from '../../../../../ValueRangeBuilder/ValueRangeBuilder';
import { getWidgetFormStyles } from '../WidgetForm.styles';
import TwinPropertyDropown from '../../Internal/TwinPropertyDropdown';
import { BehaviorFormContext } from '../../BehaviorsForm';

const GaugeWidgetBuilder: React.FC<IGaugeWidgetBuilderProps> = ({
    formData,
    setFormData,
    setIsWidgetConfigValid,
    valueRangeRef
}) => {
    const { t } = useTranslation();
    const [areValueRangesValid, setAreValueRangesValid] = useState(true);
    const { behaviorToEdit } = useContext(BehaviorFormContext);

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

    const onPropertyChange = useCallback(
        (option: string) => {
            setFormData(
                produce((draft) => {
                    draft.valueExpression = option;
                })
            );
        },
        [setFormData]
    );

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
            <TwinPropertyDropown
                behavior={behaviorToEdit}
                defaultSelectedKey={formData.valueExpression}
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
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
