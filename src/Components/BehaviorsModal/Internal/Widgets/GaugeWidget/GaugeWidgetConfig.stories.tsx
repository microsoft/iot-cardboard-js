import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import GaugeWidget from './GaugeWidget';
import { IGaugeWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorModalMode } from '../../../../../Models/Constants';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getWidgetClassNames } from '../WidgetsContainer.styles';
import { useTheme } from '@fluentui/react';
import GaugeData from '../../../../../Adapters/__mockData__/MockGaugeConfigData.json';
const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/GaugeWidget/GaugeConfig',
    component: GaugeWidget,
    decorators: [
        getDefaultStoryDecorator<{ widget: IGaugeWidget }>(wrapperStyle)
    ]
};
const twinName = 'PrimaryTwin',
    propertyName = 'Outflow';
type GaugeWidgetStory = ComponentStory<typeof GaugeWidget>;

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
                        [propertyName]: 20
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
    widget: GaugeData[0]
};

export const RangesWithGaps = Template.bind({});
RangesWithGaps.args = {
    widget: GaugeData[1]
};
export const InfinityOnlyRange = Template.bind({});
InfinityOnlyRange.args = {
    widget: GaugeData[2]
};
