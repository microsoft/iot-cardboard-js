import { Icon, PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetFormMode, WidgetType } from '../../../../Models/Constants';
import { BehaviorFormContext } from './BehaviorsForm';

// Note, this widget form does not currently support panels
const WidgetForm: React.FC<any> = () => {
    const { widgetFormInfo } = useContext(BehaviorFormContext);
    const { t } = useTranslation();

    const getWidgetBuilder = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return <GaugeWidgetBuilder />;
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
            </div>
        </>
    );
};

const GaugeWidgetBuilder: React.FC = () => {
    const { t } = useTranslation();
    const { widgetFormInfo } = useContext(BehaviorFormContext);
    return <div></div>;
};

export default WidgetForm;
