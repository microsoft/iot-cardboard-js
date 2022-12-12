import React, { useCallback, useState } from 'react';
import {
    ITimeSeriesTwinCalloutProps,
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
} from './TimeSeriesTwinCallout.types';
import { getStyles } from './TimeSeriesTwinCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    DirectionalHint,
    Stack,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import TwinSearch from '../../../TwinSearch/TwinSearch';
import produce from 'immer';
import ModelledPropertyBuilder from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { PRIMARY_TWIN_NAME } from '../../../../Models/Constants/Constants';

const defaultTimeSeriesTwin: IDataHistoryTimeSeriesTwin = {
    twinId: '',
    twinPropertyName: '',
    label: ''
};

const getClassNames = classNamesFunction<
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
>();

const TimeSeriesTwinCallout: React.FC<ITimeSeriesTwinCalloutProps> = (
    props
) => {
    const {
        adapter,
        timeSeriesTwin,
        target,
        onDismiss,
        onPrimaryActionClick,
        styles
    } = props;

    // state
    const [
        timeSeriesTwinToEdit,
        setTimeSeriesTwinToEdit
    ] = useState<IDataHistoryTimeSeriesTwin>(
        timeSeriesTwin || defaultTimeSeriesTwin
    );
    const isAddDisabled = !(
        timeSeriesTwinToEdit.twinId && timeSeriesTwinToEdit.twinPropertyName
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const handleTwinIdChange = useCallback((selectedTwinId: string) => {
        setTimeSeriesTwinToEdit(
            produce((draft) => {
                draft.twinId = selectedTwinId;
            })
        );
    }, []);
    const handleTwinPropertyChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            setTimeSeriesTwinToEdit(
                produce((draft) => {
                    draft.twinPropertyName =
                        newPropertyExpression.property.localPath; // not assigning property 'name' but 'localPath' instead in case the property is a nested one
                })
            );
        },
        []
    );
    const handleLabelChange = useCallback((_event, label: string) => {
        setTimeSeriesTwinToEdit(
            produce((draft) => {
                draft.label = label;
            })
        );
    }, []);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Callout
                target={target}
                styles={classNames.subComponentStyles.callout}
                onDismiss={onDismiss}
                directionalHint={DirectionalHint.rightCenter}
                isBeakVisible={false}
            >
                <Stack tokens={{ childrenGap: 12 }}>
                    <Stack tokens={{ childrenGap: 8 }}>
                        <TwinSearch
                            adapter={adapter}
                            onSelectTwinId={handleTwinIdChange}
                            isInspectorDisabled={true}
                            twinId={timeSeriesTwinToEdit.twinId}
                            initialSelectedValue={timeSeriesTwinToEdit.twinId}
                            disableDropdownDescription
                            dropdownLabel={t('twinId')}
                        />
                        <ModelledPropertyBuilder
                            customLabel={t(
                                'dataHistoryExplorer.builder.timeSeriesTwin.property'
                            )}
                            adapter={adapter}
                            twinIdParams={{
                                primaryTwinIds: [timeSeriesTwinToEdit.twinId]
                            }}
                            mode={ModelledPropertyBuilderMode.PROPERTY_SELECT}
                            propertyExpression={{
                                expression: timeSeriesTwinToEdit.twinPropertyName
                                    ? `${PRIMARY_TWIN_NAME}.${timeSeriesTwinToEdit.twinPropertyName}`
                                    : ''
                            }}
                            onChange={handleTwinPropertyChange}
                            required
                        />
                        <TextField
                            placeholder={t(
                                'widgets.dataHistory.form.timeSeries.labelPlaceholder'
                            )}
                            label={t(
                                'widgets.dataHistory.form.timeSeries.label'
                            )}
                            value={timeSeriesTwinToEdit?.label}
                            onChange={handleLabelChange}
                        />
                    </Stack>
                    <Stack
                        horizontal
                        horizontalAlign={'end'}
                        tokens={{ childrenGap: 8 }}
                    >
                        <PrimaryButton
                            text={t('add')}
                            onClick={() =>
                                onPrimaryActionClick(timeSeriesTwinToEdit)
                            }
                            disabled={isAddDisabled}
                            styles={classNames.subComponentStyles.addButton?.()}
                        />
                    </Stack>
                </Stack>
            </Callout>
        </div>
    );
};

export default styled<
    ITimeSeriesTwinCalloutProps,
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
>(TimeSeriesTwinCallout, getStyles);
