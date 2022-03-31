import { DefaultButton, PrimaryButton, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    WidgetType,
    defaultGaugeWidget,
    defaultLinkWidget,
    VisualType
} from '../../../../../Models/Classes/3DVConfig';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import {
    IBehavior,
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
import LinkWidgetBuilder from './WidgetBuilders/LinkWidgetBuilder';
import { linkedTwinName } from '../../../../../Models/Constants';
import { createGUID, deepCopy } from '../../../../../Models/Services/Utils';
import { WidgetFormInfo } from '../../../ADT3DSceneBuilder.types';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';

const createWidget = (draft, widgetFormInfo: WidgetFormInfo, id: string) => {
    const popOver = draft.visuals?.find(
        (visual) => visual.type === VisualType.Popover
    ) as IPopoverVisual;

    if (popOver) {
        const widgets = popOver?.widgets;

        const newWidget = {
            ...getDefaultFormData(widgetFormInfo),
            id
        };

        widgets
            ? popOver.widgets.push(newWidget)
            : (popOver.widgets = [newWidget]);
    }
};

const getDefaultFormData = (widgetFormInfo: WidgetFormInfo) => {
    switch (widgetFormInfo.widget.data.type) {
        case WidgetType.Gauge:
            return defaultGaugeWidget;
        case WidgetType.Link:
            return defaultLinkWidget;
        default:
            return null;
    }
};

const getWidgets = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0].widgets;

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

    const { t } = useTranslation();

    const [activeWidgetId, setActiveWidgetId] = useState<string>(null);

    // On mount, create or locate widget
    useEffect(() => {
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            const newWidgetId = createGUID();
            setBehaviorToEdit(
                produce((draft) => {
                    createWidget(draft, widgetFormInfo, newWidgetId);
                })
            );
            setActiveWidgetId(newWidgetId);
        } else if (widgetFormInfo.mode === WidgetFormMode.EditWidget) {
            setActiveWidgetId(widgetFormInfo.widgetId);
        }
    }, []);

    const updateWidgetData = (widgetData: IWidget) => {
        const dataClone = deepCopy(widgetData);
        setBehaviorToEdit(
            produce((draft) => {
                const widgets = getWidgets(draft);
                const widgetToUpdateIdx = widgets.findIndex(
                    (w) => w.id === activeWidgetId
                );
                widgets[widgetToUpdateIdx] = dataClone;
            })
        );
    };

    const getWidgetBuilder = () => {
        const widgetData = getWidgets(behaviorToEdit).find(
            (w) => w.id === activeWidgetId
        );

        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return (
                    <GaugeWidgetBuilder
                        formData={widgetData as IGaugeWidget}
                        setFormData={updateWidgetData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            case WidgetType.Link:
                return (
                    <LinkWidgetBuilder
                        formData={widgetData as ILinkWidget}
                        setFormData={updateWidgetData}
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

    if (!activeWidgetId) return null;
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
                    onClick={() =>
                        setWidgetFormInfo({ mode: WidgetFormMode.Committed })
                    }
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
                        setWidgetFormInfo({ mode: WidgetFormMode.Cancelled });
                    }}
                />
            </PanelFooter>
        </>
    );
};

export default WidgetForm;
