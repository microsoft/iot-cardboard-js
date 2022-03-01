import { Position, SpinButton, TextField, Toggle } from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { primaryTwinName } from '../../../../../../Models/Constants';
import { Intellisense } from '../../../../../../Components/AutoComplete/Intellisense';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import { IWidgetBuilderFormDataProps } from '../../../../ADT3DSceneBuilder.types';

const GaugeWidgetBuilder: React.FC<IWidgetBuilderFormDataProps> = ({
    formData,
    setFormData,
    behaviorToEdit
}) => {
    const { t } = useTranslation();
    const [propertyNames, setPropertyNames] = useState<string[]>(null);
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);

    if (!propertyNames) {
        adapter
            .getCommonTwinPropertiesForBehavior(sceneId, config, behaviorToEdit)
            .then((properties) => {
                setPropertyNames(properties);
            });
    }

    function getPropertyNames(twinId: string) {
        return twinId === primaryTwinName ? propertyNames : [];
    }

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
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t('3dSceneBuilder.expression'),
                        placeholder: t('3dSceneBuilder.expressionPlaceholder'),
                        multiline:
                            formData.controlConfiguration.expression.length > 40
                    }
                }}
                defaultValue={formData.controlConfiguration.expression}
                onChange={(newVal) => {
                    setFormData(
                        produce((draft) => {
                            draft.controlConfiguration.expression = newVal;
                        })
                    );
                }}
                aliasNames={[primaryTwinName]}
                getPropertyNames={getPropertyNames}
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
