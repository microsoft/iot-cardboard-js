import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import GaugeWidget from './GaugeWidget';
import gaugeData from '../../../../../Adapters/__mockData__/MockGaugeData.json';
import { IGaugeWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
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
InfinityValue.args = {
    widget: gaugeData[0]
};

export const TrillionValue = Template.bind({});
TrillionValue.args = {
    widget: gaugeData[1]
};

export const BillionValue = Template.bind({});
BillionValue.args = {
    widget: gaugeData[2]
};

export const MillionValue = Template.bind({});
MillionValue.args = {
    widget: gaugeData[3]
};

export const ThousandsValue = Template.bind({});
ThousandsValue.args = {
    widget: gaugeData[4]
};

export const HundredsValue = Template.bind({});
HundredsValue.args = {
    widget: gaugeData[5]
};

export const TensValue = Template.bind({});
TensValue.args = {
    widget: gaugeData[6]
};

export const OnesValue = Template.bind({});
OnesValue.args = {
    widget: gaugeData[7]
};

export const BillionthValue = Template.bind({});
BillionthValue.args = {
    widget: gaugeData[8]
};

export const MillionthValue = Template.bind({});
MillionthValue.args = {
    widget: gaugeData[9]
};

export const HundredthValue = Template.bind({});
HundredthValue.args = {
    widget: gaugeData[10]
};
