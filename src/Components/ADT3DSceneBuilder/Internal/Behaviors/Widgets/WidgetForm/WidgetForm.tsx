import { DefaultButton, PrimaryButton, useTheme } from '@fluentui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    WidgetType,
    defaultGaugeWidget,
    defaultLinkWidget,
    defaultValueWidget,
    defaultDataHistoryWidget,
    defaultPowerBIWidget
} from '../../../../../../Models/Classes/3DVConfig';
import { WidgetFormMode } from '../../../../../../Models/Constants/Enums';
import {
    IBehavior,
    IDataHistoryWidget,
    IGaugeWidget,
    ILinkWidget,
    IPowerBIWidget,
    IValueWidget,
    IWidget
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import PanelFooter from '../../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../../Shared/PanelForms.styles';
import { getWidgetFormStyles } from './WidgetForm.styles';
import GaugeWidgetBuilder from '../WidgetBuilders/GaugeWidgetBuilder';
import LinkWidgetBuilder from '../WidgetBuilders/LinkWidgetBuilder';
import { WidgetFormInfo } from '../../../../ADT3DSceneBuilder.types';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import ValueWidgetBuilder from '../WidgetBuilders/ValueWidgetBuilder';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useBehaviorFormContext } from '../../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';
import DataHistoryWidgetBuilder from '../WidgetBuilders/DataHistoryWidgetBuilder/DataHistoryWidgetBuilder';
import PowerBIWidgetBuilder from '../../../../../PowerBIWidget/Internal/PowerBIWidgetBuilder/PowerBIWidgetBuilder';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WidgetForm', debugLogging);

const getDefaultFormData = (widgetFormInfo: WidgetFormInfo) => {
    switch (widgetFormInfo.widget.data.type) {
        case WidgetType.Gauge:
            return defaultGaugeWidget;
        case WidgetType.Link:
            return defaultLinkWidget;
        case WidgetType.Value:
            return defaultValueWidget;
        case WidgetType.DataHistory:
            return defaultDataHistoryWidget;
        case WidgetType.PowerBI:
            return defaultPowerBIWidget;
        default:
            return null;
    }
};

const getWidgets = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0]?.widgets ||
    [];

const getActiveWidget = (activeWidgetId: string, behavior: IBehavior) =>
    getWidgets(behavior).find((w) => w.id === activeWidgetId);

const WidgetForm: React.FC = () => {
    const { widgetFormInfo, setWidgetFormInfo } = useContext(
        SceneBuilderContext
    );

    const {
        behaviorFormState,
        behaviorFormDispatch
    } = useBehaviorFormContext();

    const [isWidgetConfigValid, setIsWidgetConfigValid] = useState(true);

    const { t } = useTranslation();

    const [activeWidgetId, setActiveWidgetId] = useState(null);

    // On initial render - create or locate widget
    useEffect(() => {
        logDebugConsole(
            'debug',
            'Setting initial widget state. {mode, widgetId}',
            widgetFormInfo.mode,
            widgetFormInfo.widgetId
        );
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            const newWidgetId = widgetFormInfo.widgetId;
            behaviorFormDispatch({
                type:
                    BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE,
                payload: {
                    widget: {
                        ...getDefaultFormData(widgetFormInfo),
                        id: newWidgetId
                    }
                }
            });
            setActiveWidgetId(newWidgetId);
        } else if (widgetFormInfo.mode === WidgetFormMode.EditWidget) {
            setActiveWidgetId(widgetFormInfo.widgetId);
        }
    }, []);

    const updateWidgetData = useCallback(
        (widgetData: IWidget) => {
            if (activeWidgetId) {
                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE,
                    payload: {
                        widget: widgetData
                    }
                });
            }
        },
        [activeWidgetId, behaviorFormDispatch]
    );

    const getWidgetBuilder = () => {
        const widgetData = getActiveWidget(
            activeWidgetId,
            behaviorFormState.behaviorToEdit
        );

        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return (
                    <GaugeWidgetBuilder
                        formData={widgetData as IGaugeWidget}
                        updateWidgetData={updateWidgetData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            case WidgetType.Link:
                return (
                    <LinkWidgetBuilder
                        formData={widgetData as ILinkWidget}
                        updateWidgetData={updateWidgetData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            case WidgetType.Value:
                return (
                    <ValueWidgetBuilder
                        formData={widgetData as IValueWidget}
                        updateWidgetData={updateWidgetData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            case WidgetType.DataHistory:
                return (
                    <DataHistoryWidgetBuilder
                        formData={widgetData as IDataHistoryWidget}
                        updateWidgetData={updateWidgetData}
                        setIsWidgetConfigValid={setIsWidgetConfigValid}
                    />
                );
            case WidgetType.PowerBI:
                return (
                    <PowerBIWidgetBuilder
                        formData={widgetData as IPowerBIWidget}
                        updateWidgetData={updateWidgetData}
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

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 0);

    if (!getActiveWidget(activeWidgetId, behaviorFormState.behaviorToEdit)) {
        logDebugConsole(
            'warn',
            'No active widget found. Rendering nothing. {widgetId, behavior}',
            activeWidgetId,
            behaviorFormState.behaviorToEdit
        );
        return null;
    }
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
