import { useTheme } from '@fluentui/react';
import React, { useContext } from 'react';
import { WidgetType } from '../../../../Models/Classes/3DVConfig';
import {
    IPopoverVisual,
    IWidget
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import DataHistoryWidget from './DataHistoryWidget/DataHistoryWidget';
import GaugeWidget from './GaugeWidget/GaugeWidget';
import { LinkWidget } from './LinkWidget/LinkWidget';
import { ValueWidget } from './ValueWidget/ValueWidget';
import {
    getWidgetClassNames,
    widgetContainerClassNames
} from './WidgetsContainer.styles';

interface IWidgetContainerProps {
    popoverVisual: IPopoverVisual;
}

const makeWidget = (widget: IWidget) => {
    switch (widget.type) {
        case WidgetType.Link:
            return <LinkWidget key={widget.id} widget={widget} />;
        case WidgetType.Gauge:
            return <GaugeWidget key={widget.id} widget={widget} />;
        case WidgetType.Value:
            return <ValueWidget key={widget.id} widget={widget} />;
        case WidgetType.DataHistory:
            return <DataHistoryWidget key={widget.id} widget={widget} />;
        default:
            return null;
    }
};

const WidgetsContainer: React.FC<IWidgetContainerProps> = ({
    popoverVisual
}) => {
    const { mode, activeWidgetId } = useContext(BehaviorsModalContext);
    const theme = useTheme();

    return (
        <div className={widgetContainerClassNames.widgetsContainer}>
            {popoverVisual.widgets.map((widget) => (
                <div
                    key={widget.id}
                    className={
                        widget.type === WidgetType.DataHistory
                            ? getWidgetClassNames(
                                  theme,
                                  mode,
                                  activeWidgetId === widget.id
                              ).wideWidget
                            : getWidgetClassNames(
                                  theme,
                                  mode,
                                  activeWidgetId === widget.id
                              ).widget
                    }
                >
                    {makeWidget(widget)}
                </div>
            ))}
        </div>
    );
};

export default React.memo(WidgetsContainer);
