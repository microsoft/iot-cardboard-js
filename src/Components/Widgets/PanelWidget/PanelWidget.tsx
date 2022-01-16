import React from 'react';
import {
    IControlConfiguration,
    IVisual,
    IWidget
} from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { GaugeWidget } from '../GaugeWidget/GaugeWidget';
import { LinkWidget } from '../LinkWidget/LinkWidget';
import './PanelWidget.scss';

interface IProp {
    config: IVisual | IControlConfiguration;
    twins: Record<string, DTwin>;
}

function makeWidget(
    index: number,
    widget: IWidget,
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
        case 'Panel':
            return (
                <PanelWidget
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
            <div>
                {config.title && (
                    <div className="cb-adt-3dviewer-popup-title">
                        {config.title}
                    </div>
                )}
                <div
                    className={`cb-panel-widget-container ${
                        config.isHorizontal ? 'cb-panel-widget-fdrow' : ''
                    }`}
                >
                    {config.widgets.map((widget, index) =>
                        makeWidget(index, widget, twins)
                    )}
                </div>
            </div>
        );
    }

    return null;
};
