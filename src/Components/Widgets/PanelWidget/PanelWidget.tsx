import React from 'react';
import { Visual, Widget } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { GaugeWidget } from '../GaugeWidget/GaugeWidget';
import { LinkWidget } from '../LinkWidget/LinkWidget';
import './PanelWidget.scss';

interface IProp {
    config: Visual;
    twins: Record<string, DTwin>;
}

function makeWidget(
    index: number,
    widget: Widget,
    twins: Record<string, DTwin>
) {
    switch (widget.type) {
        case 'Link':
            return (
                <LinkWidget
                    key={index}
                    config={widget.controlConfiguration}
                    twins={twins}
                />
            );
        case 'Gauge':
            return (
                <GaugeWidget
                    key={index}
                    config={widget.controlConfiguration}
                    twins={twins}
                />
            );
        default:
            return null;
    }
}

export const PanelWidget: React.FC<IProp> = ({ config, twins }) => {
    if (config?.widgets?.length) {
        return (
            <div className="cb-panel-widget-container">
                {config.widgets.map((widget, index) =>
                    makeWidget(index, widget, twins)
                )}
            </div>
        );
    }

    return null;
};
