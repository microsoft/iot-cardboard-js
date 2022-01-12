import React from 'react';
import { GaugeWidget } from '../GaugeWidget/GaugeWidget';
import { LinkWidget } from '../LinkWidget/LinkWidget';
import './PanelWidget.scss';

interface IProp {
    config: any;
    twins: any;
}

function makeWidget(index: any, widget: any, twins: any) {
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
