import { Position, SpinButton, TextField, Toggle } from '@fluentui/react';
import produce from 'immer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IWidgetBuilderFormDataProps } from '../../../../ADT3DSceneBuilder.types';

const GaugeWidgetBuilder: React.FC<IWidgetBuilderFormDataProps> = ({
    formData,
    setFormData
}) => {
    const { t } = useTranslation();

    const warningBreakPointEnabled =
        typeof formData.controlConfiguration.valueBreakPoints?.[0] === 'number';

    return (
        <div>
            <TextField
                label={t('label')}
                value={formData.controlConfiguration.label}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce((draft) => {
                            draft.controlConfiguration.label = newVal;
                        })
                    )
                }
            />
            <TextField
                label={t('3dSceneBuilder.unitOfMeasure')}
                value={formData.controlConfiguration.units}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce((draft) => {
                            draft.controlConfiguration.units = newVal;
                        })
                    )
                }
            />
            <TextField
                label={t('3dSceneBuilder.expression')}
                value={formData.controlConfiguration.expression}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce((draft) => {
                            draft.controlConfiguration.expression = newVal;
                        })
                    )
                }
            />
            <Toggle
                label={t('3dSceneBuilder.warningBreakPointToggleLabel')}
                checked={warningBreakPointEnabled}
                onText={t('on')}
                offText={t('off')}
                onChange={(_e, checked) => {
                    setFormData(
                        produce((draft) => {
                            if (checked) {
                                draft.controlConfiguration.valueBreakPoints = [
                                    0
                                ];
                                draft.controlConfiguration.colors = ['#ffff00'];
                            } else {
                                draft.controlConfiguration.valueBreakPoints = [];
                                draft.controlConfiguration.colors = [];
                            }
                        })
                    );
                }}
            />
            {warningBreakPointEnabled && (
                <SpinButton
                    label={t('3dSceneBuilder.warningBreakPointLabel')}
                    labelPosition={Position.top}
                    value={String(
                        formData.controlConfiguration.valueBreakPoints[0]
                    )}
                    onChange={(_ev, newVal) => {
                        setFormData(
                            produce((draft) => {
                                const valueBreakPoints =
                                    draft.controlConfiguration.valueBreakPoints;
                                valueBreakPoints[0] = Number(newVal);
                            })
                        );
                    }}
                />
            )}
        </div>
    );
};

export default GaugeWidgetBuilder;
