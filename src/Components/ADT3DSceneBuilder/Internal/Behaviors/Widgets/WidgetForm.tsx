import { DefaultButton, PrimaryButton, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    WidgetType,
    defaultGaugeWidget,
    defaultLinkWidget,
    VisualType
} from '../../../../../Models/Classes/3DVConfig';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import {
    IGaugeWidget,
    ILinkWidget,
    IPopoverVisual,
    IWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';
import { BehaviorFormContext } from '../BehaviorsForm';
import { getWidgetFormStyles } from './WidgetForm.styles';
import GaugeWidgetBuilder from './WidgetBuilders/GaugeWidgetBuilder';
import { IValueRangeBuilderHandle } from '../../../../ValueRangeBuilder/ValueRangeBuilder.types';
import LinkWidgetBuilder from './WidgetBuilders/LinkWidgetBuilder';
import { linkedTwinName } from '../../../../../Models/Constants';
import { createGUID, deepCopy } from '../../../../../Models/Services/Utils';

// Note, this widget form does not currently support panels
const WidgetForm: React.FC = () => {
    const {
        widgetFormInfo,
        setWidgetFormInfo,
        config,
        sceneId,
        adapter
    } = useContext(SceneBuilderContext);

    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const [propertyNames, setPropertyNames] = useState<string[]>(null);

    const getPropertyNames = (twinId: string) => {
        return twinId === linkedTwinName ? propertyNames : [];
    };

    const [isWidgetConfigValid, setIsWidgetConfigValid] = useState(true);

    const gaugeValueRangeRef = useRef<IValueRangeBuilderHandle>(null);

    const { t } = useTranslation();

    const getDefaultFormData = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return defaultGaugeWidget;
            case WidgetType.Link:
                return defaultLinkWidget;
            default:
                return null;
        }
    };

    const [formData, setFormData] = useState<IWidget>(
        widgetFormInfo.mode === WidgetFormMode.CreateWidget
            ? getDefaultFormData()
            : widgetFormInfo.widget.data
    );

    const getWidgetBuilder = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return (
                    <GaugeWidgetBuilder
                        formData={formData as IGaugeWidget}
                        setFormData={setFormData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                        valueRangeRef={gaugeValueRangeRef}
                    />
                );
            case WidgetType.Link:
                return (
                    <LinkWidgetBuilder
                        formData={formData as ILinkWidget}
                        setFormData={setFormData}
                        getIntellisensePropertyNames={getPropertyNames}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            default:
                return (
                    <div className="cb-widget-not-supported">
                        {t('widgets.notSupported')}
                    </div>
                );
        }
    };

    const onSaveWidgetForm = () => {
        const formDataToSave = deepCopy(formData);

        if (widgetFormInfo.widget.data.type === WidgetType.Gauge) {
            (formDataToSave as IGaugeWidget).widgetConfiguration.valueRanges = gaugeValueRangeRef.current.getValueRanges();
        }

        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft.visuals?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;

                    if (popOver) {
                        const widgets = popOver?.widgets;
                        widgets
                            ? popOver.widgets.push(formDataToSave)
                            : (popOver.widgets = [formDataToSave]);
                    }
                })
            );
        }
        if (widgetFormInfo.mode === WidgetFormMode.EditWidget) {
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft.visuals?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;

                    if (
                        popOver &&
                        typeof widgetFormInfo.widgetIdx === 'number'
                    ) {
                        const widgets = popOver?.widgets;
                        widgets[widgetFormInfo.widgetIdx] = formDataToSave;
                    }
                })
            );
        }

        setWidgetFormInfo(null);
        setFormData(null);
    };

    useEffect(() => {
        if (!propertyNames) {
            adapter
                .getCommonTwinPropertiesForBehavior(
                    sceneId,
                    config,
                    behaviorToEdit
                )
                .then((properties) => {
                    setPropertyNames(properties);
                });
        }
    }, [sceneId, config, behaviorToEdit]);

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 0);
    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
                    <div className={customStyles.description}>
                        {widgetFormInfo.widget.description}
                    </div>
                </div>
                {getWidgetBuilder()}
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'widget-form-primary-button'}
                    onClick={onSaveWidgetForm}
                    text={
                        widgetFormInfo.mode === WidgetFormMode.CreateWidget
                            ? t('3dSceneBuilder.createWidget')
                            : t('3dSceneBuilder.updateWidget')
                    }
                    disabled={!isWidgetConfigValid}
                />
                <DefaultButton
                    data-testid={'widget-form-secondary-button'}
                    text={t('cancel')}
                    onClick={() => {
                        setWidgetFormInfo(null);
                        setFormData(null);
                    }}
                />
            </PanelFooter>
        </>
    );
};

export default WidgetForm;
