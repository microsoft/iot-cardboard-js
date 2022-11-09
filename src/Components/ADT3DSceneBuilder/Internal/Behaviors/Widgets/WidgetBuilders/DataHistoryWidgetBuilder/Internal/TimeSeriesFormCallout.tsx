import React, {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    FocusTrapCallout,
    PrimaryButton,
    Stack,
    Text,
    TextField,
    useTheme
} from '@fluentui/react';
import { IDataHistoryBasicTimeSeries } from '../../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import produce from 'immer';
import {
    getCardboardListCalloutComponentStyles,
    getCardboardListCalloutStyles
} from '../../../../../../../CardboardListCallout/CardboardListCallout.styles';
import { useBehaviorFormContext } from '../../../../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import ModelledPropertyBuilder from '../../../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import { SceneBuilderContext } from '../../../../../../ADT3DSceneBuilder';
import {
    ModelledPropertyBuilderMode,
    numericPropertyValueTypes,
    PropertyExpression
} from '../../../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { createGUID } from '../../../../../../../../Models/Services/Utils';
import { PropertyValueType } from '../../../../../../../../Models/Constants/Constants';

interface IProp {
    calloutTarget: string;
    series: IDataHistoryBasicTimeSeries;
    onDismiss: () => void;
    onPrimaryActionClick: (item: IDataHistoryBasicTimeSeries) => void;
}

enum Mode {
    'Add',
    'Edit'
}

const defaultSeries: IDataHistoryBasicTimeSeries = {
    id: '',
    expression: '',
    propertyType: 'double'
};

// Allow numerics + string as users often use string properties as the lowest common denominator
const allowedTimeseriesPropertyValueTypes: Array<PropertyValueType> = [
    'string',
    ...numericPropertyValueTypes
];

/** This callout component consists form for time series authoring to show in line chart */
const TimeSeriesFormCallout: React.FC<IProp> = ({
    calloutTarget,
    series,
    onDismiss,
    onPrimaryActionClick
}: IProp) => {
    const [mode] = useState<Mode>(series ? Mode.Edit : Mode.Add);
    const [
        seriesToEdit,
        setSeriesToEdit
    ] = useState<IDataHistoryBasicTimeSeries>(null);
    const { t } = useTranslation();
    const {
        config,
        sceneId,
        adapter,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);
    const { behaviorFormState } = useBehaviorFormContext();

    useEffect(() => {
        if (series) {
            setSeriesToEdit(series);
        } else {
            const newId = createGUID();
            defaultSeries.id = newId;
            setSeriesToEdit(defaultSeries);
        }
    }, [series]);

    const title =
        mode === Mode.Add
            ? t('widgets.dataHistory.form.timeSeries.add')
            : t('widgets.dataHistory.form.timeSeries.edit');

    const primaryActionLabel = series
        ? t('widgets.dataHistory.form.timeSeries.update')
        : t('widgets.dataHistory.form.timeSeries.add');

    const handlePropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            setSeriesToEdit(
                produce((draft) => {
                    draft.expression = newPropertyExpression.expression;
                    draft.propertyType =
                        newPropertyExpression.property.propertyType;
                })
            );
        },
        []
    );

    const handleUnitChange = useCallback((_event, unit: string) => {
        setSeriesToEdit(
            produce((draft) => {
                draft.unit = unit;
            })
        );
    }, []);

    const handleLabelChange = useCallback((_event, label: string) => {
        setSeriesToEdit(
            produce((draft) => {
                draft.label = label;
            })
        );
    }, []);

    const isFormValid = useMemo(() => {
        return seriesToEdit?.expression;
    }, [seriesToEdit]);

    const theme = useTheme();
    const styles = getCardboardListCalloutComponentStyles(theme);
    const calloutStyles = getCardboardListCalloutStyles(theme);
    return (
        <FocusTrapCallout
            focusTrapProps={{
                isClickableOutsideFocusTrap: true
            }}
            target={`#${calloutTarget}`}
            isBeakVisible={false}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={onDismiss}
            styles={calloutStyles}
        >
            <Stack tokens={{ childrenGap: 8 }}>
                <h4 className={styles.title}>{title}</h4>
                <Text className={styles.description}>
                    {t('widgets.dataHistory.form.timeSeries.description')}
                </Text>
                <ModelledPropertyBuilder
                    adapter={adapter}
                    twinIdParams={{
                        behavior: behaviorFormState.behaviorToEdit,
                        config,
                        sceneId,
                        selectedElements
                    }}
                    mode={ModelledPropertyBuilderMode.PROPERTY_SELECT}
                    propertyExpression={{
                        expression: seriesToEdit?.expression
                    }}
                    description={
                        !numericPropertyValueTypes.includes(
                            seriesToEdit.propertyType
                        )
                            ? t(
                                  'widgets.dataHistory.form.timeSeries.nonNumericWarning'
                              )
                            : undefined
                    }
                    onChange={handlePropertyChange}
                    allowedPropertyValueTypes={
                        allowedTimeseriesPropertyValueTypes
                    }
                    required
                />
                <TextField
                    placeholder={t(
                        'widgets.dataHistory.form.timeSeries.labelPlaceholder'
                    )}
                    label={t('widgets.dataHistory.form.timeSeries.label')}
                    value={seriesToEdit?.label}
                    onChange={handleLabelChange}
                />
                <TextField
                    placeholder={t(
                        'widgets.dataHistory.form.timeSeries.unitPlaceholder'
                    )}
                    label={t('widgets.dataHistory.form.timeSeries.unit')}
                    value={seriesToEdit?.unit}
                    onChange={handleUnitChange}
                />
                <PrimaryButton
                    className={styles.primaryButton}
                    onClick={() => onPrimaryActionClick(seriesToEdit)}
                    disabled={!isFormValid}
                >
                    {primaryActionLabel}
                </PrimaryButton>
            </Stack>
        </FocusTrapCallout>
    );
};

export default memo(TimeSeriesFormCallout);
