import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultGaugeWidget,
    IWidget
} from '../../../../Models/Classes/3DVConfig';

import { WidgetFormMode, WidgetType } from '../../../../Models/Constants';
import { BehaviorFormContext } from './BehaviorsForm';
import GaugeWidgetBuilder from './WidgetBuilders/GaugeWidgetBuilder';

// Note, this widget form does not currently support panels
const WidgetForm: React.FC<any> = () => {
    const { widgetFormInfo, setWidgetFormInfo } = useContext(
        BehaviorFormContext
    );
    const { t } = useTranslation();

    const getDefaultFormData = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return defaultGaugeWidget;
            default:
                return null;
        }
    };

    const [formData, setFormData] = useState<IWidget>(getDefaultFormData());

    const getWidgetBuilder = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return (
                    <GaugeWidgetBuilder
                        formData={formData}
                        setFormData={setFormData}
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

    return (
        <>
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <div className="cb-widget-builder-header-container">
                        <div className="cb-widget-builder-header">
                            <Icon iconName={widgetFormInfo.widget.iconName} />
                            <span>{widgetFormInfo.widget.title}</span>
                        </div>
                        <div className="cb-widget-builder-subheader">
                            {widgetFormInfo.widget.description}
                        </div>
                    </div>
                    {getWidgetBuilder()}
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={() => null}
                    text={
                        widgetFormInfo.mode === WidgetFormMode.Create
                            ? t('create')
                            : t('update')
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
