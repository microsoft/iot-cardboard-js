import { TextField } from '@fluentui/react';
import produce from 'immer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IWidgetBuilderFormDataProps } from '../../ADT3DSceneBuilder.types';

const GaugeWidgetBuilder: React.FC<IWidgetBuilderFormDataProps> = ({
    formData,
    setFormData
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <TextField
                label={t('label')}
                value={formData.controlConfiguration.label}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce(
                            (draft) =>
                                (draft.controlConfiguration.label = newVal)
                        )
                    )
                }
            />
            <TextField
                label={t('3dSceneBuilder.unitOfMeasure')}
                value={formData.controlConfiguration.units}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce(
                            (draft) =>
                                (draft.controlConfiguration.units = newVal)
                        )
                    )
                }
            />
            <TextField
                label={t('3dSceneBuilder.expression')}
                value={formData.controlConfiguration.expression}
                onChange={(_ev, newVal) =>
                    setFormData(
                        produce(
                            (draft) =>
                                (draft.controlConfiguration.expression = newVal)
                        )
                    )
                }
            />
        </div>
    );
};

export default GaugeWidgetBuilder;
