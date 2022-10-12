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
    expression: ''
};

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

    const primaryActionLabel = series ? t('edit') : t('add');

    const handlePropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            setSeriesToEdit(
                produce((draft) => {
                    draft.expression = newPropertyExpression.expression;
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
                    onChange={handlePropertyChange}
                    allowedPropertyValueTypes={numericPropertyValueTypes}
                    required
                />
                <TextField
                    placeholder={'e.g. m, m², kg, s, °C'}
                    label={t('widgets.dataHistory.form.timeSeries.unit')}
                    value={seriesToEdit?.unit}
                    onChange={handleUnitChange}
                />
                <TextField
                    placeholder={t(
                        'widgets.dataHistory.form.timeSeries.labelPlaceholder'
                    )}
                    label={t('widgets.dataHistory.form.timeSeries.label')}
                    value={seriesToEdit?.label}
                    onChange={handleLabelChange}
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
