import React from 'react';
import { WidgetType } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import {
    IPopoverVisual,
    IWidget
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { GaugeWidget } from '../GaugeWidget/GaugeWidget';
import { LinkWidget } from '../LinkWidget/LinkWidget';
import './PanelWidget.scss';

interface IProp {
    config: IPopoverVisual;
    twins: Record<string, DTwin>;
}

function makeWidget(
    index: number,
    widget: IWidget,
    twins: Record<string, DTwin>
) {
    switch (widget.type) {
        case WidgetType.Link:
            return <LinkWidget key={index} widget={widget} twins={twins} />;
        case WidgetType.Gauge:
            return <GaugeWidget key={index} widget={widget} twins={twins} />;
        default:
            return null;
    }
}

export const PanelWidget: React.FC<IProp> = ({ config, twins }) => {
    if (config?.widgets?.length) {
        return (
            <div>
                {config.title && (
                    <div className="cb-adt-3dviewer-popup-title">
                        {config.title}
                    </div>
                )}
                <div className={'cb-panel-widget-container'}>
                    {config.widgets.map((widget, index) =>
                        makeWidget(index, widget, twins)
                    )}
                </div>
            </div>
        );
    }

    return null;
};
