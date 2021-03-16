import React from 'react';
import Linechart from './Linechart/Linechart';
import Barchart from './Barchart/Barchart';
import MockAdapter from '../Adapters/MockAdapter';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { TSIComponentTypes } from '../Models/Constants';
export default {
    title: 'Components/Swapping components',
    argTypes: {
        chartType: {
            control: {
                type: 'select',
                options: [
                    TSIComponentTypes.linechart,
                    TSIComponentTypes.barchart
                ]
            }
        }
    }
};

const chartCardStyle = {
    height: '400px'
};

//TODO make this mock data static for testing purposes. Maybe implement a seed?
const mockData = MockAdapter.generateMockLineChartData(
    new SearchSpan(new Date('2020-01-01'), new Date('2020-01-02')),
    ['foo']
);

export const SwapLinechartAndBarchart = (args, { globals: { theme } }) => (
    <div style={chartCardStyle}>
        {args.chartType === TSIComponentTypes.linechart && (
            <Linechart
                data={mockData}
                chartDataOptions={null}
                chartOptions={{ theme: theme }}
            />
        )}
        {args.chartType === TSIComponentTypes.barchart && (
            <Barchart
                data={mockData}
                chartDataOptions={null}
                chartOptions={{ theme: theme }}
            />
        )}
    </div>
);

SwapLinechartAndBarchart.args = { chartType: TSIComponentTypes.linechart };
