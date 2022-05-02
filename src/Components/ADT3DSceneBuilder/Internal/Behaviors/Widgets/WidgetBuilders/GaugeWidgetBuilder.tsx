import { TextField, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IGaugeWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import ValueRangeBuilder from '../../../../../ValueRangeBuilder/ValueRangeBuilder';
import useValueRangeBuilder from '../../../../../../Models/Hooks/useValueRangeBuilder';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import useBehaviorAliasedTwinProperties from '../../../../../../Models/Hooks/useBehaviorAliasedTwinProperties';
import TwinPropertyBuilder from '../../../../../TwinPropertyBuilder/TwinPropertyBuilder';
import { getWidgetFormStyles } from '../WidgetForm/WidgetForm.styles';

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
        (option: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.valueExpression = option;
                })
            );
        },
        [updateWidgetData, formData]
    );

    // MODELLED_PROPERTY_TODO ---- V2 iteration will change to modelled properties
    // get the aliased properties for intellisense
    const { options: aliasedProperties } = useBehaviorAliasedTwinProperties({
        behavior: behaviorToEdit,
        isTwinAliasesIncluded: true
    });

    const getPropertyNames = useCallback(
        (twinAlias: string) =>
            ViewerConfigUtility.getPropertyNamesFromAliasedPropertiesByAlias(
                twinAlias,
                aliasedProperties
            ),
        [aliasedProperties]
    );

    const aliasNames = useMemo(
        () =>
            ViewerConfigUtility.getUniqueAliasNamesFromAliasedProperties(
                aliasedProperties
            ),
        [aliasedProperties]
    );

    // MODELLED_PROPERTY_TODO ---- END BLOCK
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
            <TwinPropertyBuilder
                mode="TOGGLE"
                intellisenseProps={{
                    onChange: onPropertyChange,
                    defaultValue: formData.valueExpression,
                    aliasNames: aliasNames,
                    getPropertyNames: getPropertyNames,
                    autoCompleteProps: {
                        required: true
                    }
                }}
                twinPropertyDropdownProps={{
                    adapter,
                    config,
                    sceneId,
                    behavior: behaviorToEdit,
                    defaultSelectedKey: formData.valueExpression,
                    dataTestId: 'widget-form-property-dropdown',
                    onChange: onPropertyChange,
                    required: true
                }}
            />
            <ValueRangeBuilder
                className={customStyles.rangeBuilderRoot}
                valueRangeBuilderReducer={valueRangeBuilderReducer}
            />
        </div>
    );
};

export default GaugeWidgetBuilder;
