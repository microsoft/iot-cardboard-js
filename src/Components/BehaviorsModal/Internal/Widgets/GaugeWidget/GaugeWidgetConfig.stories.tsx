import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import GaugeWidget from './GaugeWidget';
import {
    IGaugeWidget,
    IValueRangeVisual,
    ValueRangeValueType
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorModalMode } from '../../../../../Models/Constants';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getWidgetClassNames } from '../WidgetsContainer.styles';
import { useTheme } from '@fluentui/react';
import GaugeData from '../../../../../Adapters/__mockData__/MockGaugeConfigData.json';
const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GaugeWidget/Ranges',
    component: GaugeWidget,
    decorators: [
        getDefaultStoryDecorator<{ widget: IGaugeWidget }>(wrapperStyle)
    ]
};
const twinName = 'PrimaryTwin',
    propertyName = 'Outflow';
type GaugeWidgetStory = ComponentStory<typeof GaugeWidget>;

interface IValueType {
    name: string;
    range: Array<ValueRangeValueType[]>;
    colors: IValueRangeVisual[];
}

const generateValueRanges = (args: IValueType) => {
    const vr = [];
    for (let idx = 0; idx < args.range.length; idx++) {
        vr.push({
            id: `0278cd377adbc30253b0fdb6b5fcf16${idx}`,
            values: args.range[idx],
            visual: args.colors[idx]
        });
    }
    return vr;
};

const generateGaugeWidget = (args: IValueType) => {
    return {
        type: 'Gauge',
        id: '3dbbbde93325c334c93e47d077b93995',
        groupID: '8bf489e804884596afe8abb7e803d5c5',
        valueExpression: 'PrimaryTwin.Outflow',
        widgetConfiguration: {
            units: 'PSI',
            label: 'Outflow',
            valueRanges: generateValueRanges(args)
        },
        extensionProperties: {}
    };
};
const Template: GaugeWidgetStory = (args) => {
    const mode = BehaviorModalMode.viewer;
    const theme = useTheme();

    return (
        <BehaviorsModalContext.Provider
            value={{
                twins: {
                    [twinName]: {
                        $dtId: '',
                        $metadata: { $model: '' },
                        [propertyName]: 29
                    }
                },
                mode,
                activeWidgetId: undefined
            }}
        >
            <div className={getWidgetClassNames(theme, mode, false).widget}>
                <GaugeWidget {...args} />
            </div>
        </BehaviorsModalContext.Provider>
    );
};

export const RangesNoGaps = Template.bind({});
RangesNoGaps.args = {
    widget: generateGaugeWidget(GaugeData[0])
};

export const RangesInfinityUpperBound = Template.bind({});
RangesInfinityUpperBound.args = {
    widget: generateGaugeWidget(GaugeData[1])
};
export const RangesInfinityLowerBound = Template.bind({});
RangesInfinityLowerBound.args = {
    widget: generateGaugeWidget(GaugeData[2])
};
export const RangesNoInfinities = Template.bind({});
RangesNoInfinities.args = {
    widget: generateGaugeWidget(GaugeData[3])
};
export const RangesDecimals = Template.bind({});
RangesDecimals.args = {
    widget: generateGaugeWidget(GaugeData[4])
};
export const Only2Ranges = Template.bind({});
Only2Ranges.args = {
    widget: generateGaugeWidget(GaugeData[5])
};
export const SingleNumericRange = Template.bind({});
SingleNumericRange.args = {
    widget: generateGaugeWidget(GaugeData[6])
};
export const InfinityOnlyRange = Template.bind({});
InfinityOnlyRange.args = {
    widget: generateGaugeWidget(GaugeData[7])
};
