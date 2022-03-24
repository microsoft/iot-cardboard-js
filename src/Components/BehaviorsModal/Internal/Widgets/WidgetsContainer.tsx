import React from 'react';
import { WidgetType } from '../../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../../Models/Constants';
import {
    IPopoverVisual,
    IWidget
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { GaugeWidget } from './GaugeWidget/GaugeWidget';
import { LinkWidget } from './LinkWidget/LinkWidget';
import { getStyles } from './WidgetsContainer.styles';

interface IWidgetContainerProps {
    popoverVisual: IPopoverVisual;
    twins: Record<string, DTwin>;
}

const makeWidget = (widget: IWidget, twins: Record<string, DTwin>) => {
    switch (widget.type) {
        case WidgetType.Link:
            return <LinkWidget key={widget.id} widget={widget} twins={twins} />;
        case WidgetType.Gauge:
            return (
                <GaugeWidget key={widget.id} widget={widget} twins={twins} />
            );
        default:
            return null;
    }
};

const WidgetsContainer: React.FC<IWidgetContainerProps> = ({
    popoverVisual,
    twins
}) => {
    const styles = getStyles();

    return (
        <div className={styles.widgetsContainer}>
            {popoverVisual.widgets.map((widget) => (
                <div className={styles.widgetContainer}>
                    {makeWidget(widget, twins)}
                </div>
            ))}
        </div>
    );
};

export default React.memo(WidgetsContainer);
