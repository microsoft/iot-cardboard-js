import { useTheme } from '@fluentui/react';
import React, { useContext } from 'react';
import { WidgetType } from '../../../../Models/Classes/3DVConfig';
import {
    IPopoverVisual,
    IWidget
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import GaugeWidget from './GaugeWidget/GaugeWidget';
import { LinkWidget } from './LinkWidget/LinkWidget';
import { getStyles } from './WidgetsContainer.styles';

interface IWidgetContainerProps {
    popoverVisual: IPopoverVisual;
}

const makeWidget = (widget: IWidget) => {
    switch (widget.type) {
        case WidgetType.Link:
            return <LinkWidget key={widget.id} widget={widget} />;
        case WidgetType.Gauge:
            return <GaugeWidget key={widget.id} widget={widget} />;
        default:
            return null;
    }
};

const WidgetsContainer: React.FC<IWidgetContainerProps> = ({
    popoverVisual
}) => {
    const { mode } = useContext(BehaviorsModalContext);
    const theme = useTheme();
    const styles = getStyles(theme, mode);

    return (
        <div className={styles.widgetsContainer}>
            {popoverVisual.widgets.map((widget) => (
                <div key={widget.id} className={styles.widgetContainer}>
                    {makeWidget(widget)}
                </div>
            ))}
        </div>
    );
};

export default React.memo(WidgetsContainer);
