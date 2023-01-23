import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import GaugeWidget from './GaugeWidget';
import {
    IGaugeWidget,
    ValueRangeValueType
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorModalMode } from '../../../../../Models/Constants';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getWidgetClassNames } from '../WidgetsContainer.styles';
import { useTheme } from '@fluentui/react';
const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GaugeWidget/Values',
    component: GaugeWidget,
    decorators: [
        getDefaultStoryDecorator<{ widget: IGaugeWidget }>(wrapperStyle)
    ]
};

type GaugeWidgetStory = ComponentStory<typeof GaugeWidget>;
interface IValueType {
    name: string;
    range: ValueRangeValueType[];
}

const valueRanges: IValueType[] = [
    { name: 'InfinityValue', range: ['-Infinity', 'Infinity'] },
    { name: 'TrillionValue', range: [99000000000000, 100000000000000] },
    { name: 'BillionValue', range: [998456543234, 1000000000000] },
    { name: 'MillionValue', range: [-1890000, 10000000] },
    { name: 'ThousandsValue', range: [999300.4451, 1000000] },
    { name: 'HundredsValue', range: [977.432245, 1000] },
    { name: 'TensValue', range: [99.234, 1000] },
    { name: 'OnesValue', range: [9.6755432, 1000] },
    { name: 'BillionthValue', range: [0.000000001, 1000] },
    { name: 'MillionthValue', range: [0.0000001, 1000] },
    { name: 'HundredthValue', range: [0.001, 1000] }
];

const generateGaugeWidget = (args: IValueType) => {
    return {
        type: 'Gauge',
        id: '3dbbbde93325c334c93e47d077b93995',
        groupID: '8bf489e804884596afe8abb7e803d5c5',
        valueExpression: 'PrimaryTwin.Outflow',
        widgetConfiguration: {
            units: 'PSI',
            label: 'Outflow',
            valueRanges: [
                {
                    id: '0278cd377adbc30253b0fdb6b5fcf160',
                    values: args.range,
                    visual: {
                        color: '#33A1FD'
                    }
                }
            ]
        },
        extensionProperties: {}
    };
};

const Template: GaugeWidgetStory = (args) => {
    const mode = BehaviorModalMode.preview;
    const theme = useTheme();

    return (
        <BehaviorsModalContext.Provider
            value={{
                twins: {},
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

export const InfinityValue = Template.bind({});
InfinityValue.args = { widget: generateGaugeWidget(valueRanges[0]) };

export const TrillionValue = Template.bind({});
TrillionValue.args = { widget: generateGaugeWidget(valueRanges[1]) };

export const BillionValue = Template.bind({});
BillionValue.args = { widget: generateGaugeWidget(valueRanges[2]) };

export const MillionValue = Template.bind({});
MillionValue.args = { widget: generateGaugeWidget(valueRanges[3]) };

export const ThousandsValue = Template.bind({});
ThousandsValue.args = { widget: generateGaugeWidget(valueRanges[4]) };

export const HundredsValue = Template.bind({});
HundredsValue.args = { widget: generateGaugeWidget(valueRanges[5]) };

export const TensValue = Template.bind({});
TensValue.args = { widget: generateGaugeWidget(valueRanges[6]) };

export const OnesValue = Template.bind({});
OnesValue.args = {
    widget: generateGaugeWidget(valueRanges[7])
};

export const BillionthValue = Template.bind({});
BillionthValue.args = {
    widget: generateGaugeWidget(valueRanges[8])
};

export const MillionthValue = Template.bind({});
MillionthValue.args = {
    widget: generateGaugeWidget(valueRanges[9])
};

export const HundredthValue = Template.bind({});
HundredthValue.args = {
    widget: generateGaugeWidget(valueRanges[10])
};
