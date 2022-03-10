import { DefaultButton, PrimaryButton } from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    WidgetType,
    defaultGaugeWidget,
    defaultLinkWidget,
    VisualType
} from '../../../../../Models/Classes/3DVConfig';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import {
    IPopoverVisual,
    IWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';
import GaugeWidgetBuilder from './WidgetBuilders/GaugeWidgetBuilder';
import LinkWidgetBuilder from './WidgetBuilders/LinkWidgetBuilder';

// Note, this widget form does not currently support panels
const WidgetForm: React.FC<any> = () => {
    const { widgetFormInfo, setWidgetFormInfo } = useContext(
        SceneBuilderContext
    );

    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
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
                        formData={formData}
                        setFormData={setFormData}
                        behaviorToEdit={behaviorToEdit}
                    />
                );
            case WidgetType.Link:
                return (
                    <LinkWidgetBuilder
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            default:
                return (
                    <div className="cb-widget-not-supported">
                        {t('widgets.notSupported') + ' :('}
                    </div>
                );
        }
    };

    const onSaveWidgetForm = () => {
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft.visuals?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;

                    if (popOver) {
                        const widgets = popOver?.widgets;
                        widgets
                            ? popOver.widgets.push(formData)
                            : (popOver.widgets = [formData]);
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
                        widgets[widgetFormInfo.widgetIdx] = formData;
                    }
                })
            );
        }

        setWidgetFormInfo(null);
        setFormData(null);
    };

    return (
        <>
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <div className="cb-widget-builder-description-container">
                        <div className="cb-widget-builder-description">
                            {widgetFormInfo.widget.description}
                        </div>
                    </div>
                    {getWidgetBuilder()}
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={onSaveWidgetForm}
                    text={
                        widgetFormInfo.mode === WidgetFormMode.CreateWidget
                            ? t('3dSceneBuilder.createWidget')
                            : t('3dSceneBuilder.updateWidget')
                    }
                    disabled={false}
                />
                <DefaultButton
                    text={t('cancel')}
                    styles={{ root: { marginLeft: 8 } }}
                    onClick={() => {
                        setWidgetFormInfo(null);
                        setFormData(null);
                    }}
                />
            </div>
        </>
    );
};

export default WidgetForm;
