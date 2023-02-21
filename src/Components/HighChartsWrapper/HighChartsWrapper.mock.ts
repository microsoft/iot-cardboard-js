import { getMockTimeSeriesDataArrayInLocalTime } from '../../Models/SharedUtils/DataHistoryUtils';
import { IHighChartSeriesData } from './HighChartsWrapper.types';

export const HighChartsMockData: Array<IHighChartSeriesData> = [
    {
        name: 'Mock series-1',
        data: [
            { timestamp: 1340323200000, value: 115 },
            { timestamp: 1340339499317, value: 23 },
            { timestamp: 1340368246728, value: 188 },
            { timestamp: 1340390085747, value: 213 },
            { timestamp: 1340403271088, value: 245 }
        ],
        tooltipSuffix: '°F'
    },
    {
        name: 'Mock series-2',
        data: [
            { timestamp: 1340329513434, value: 272 },
            { timestamp: 1340339253976, value: 169 },
            { timestamp: 1340341675699, value: 238 },
            { timestamp: 1340385501865, value: 395 },
            { timestamp: 1340390604011, value: 109 }
        ],
        tooltipSuffix: 'cpf'
    },
    {
        name: 'Mock series-3',
        data: [
            { timestamp: 1340323200000, value: 279 },
            { timestamp: 1340332010046, value: 154 },
            { timestamp: 1340356361575, value: 157 },
            { timestamp: 1340395911660, value: 227 },
            { timestamp: 1340401653986, value: 107 }
        ],
        tooltipSuffix: 'm'
    }
];

export const HighChartsMockLargeData: Array<IHighChartSeriesData> = [
    {
        name: 'Mock series-1',
        data: getMockTimeSeriesDataArrayInLocalTime(
            1,
            500000,
            undefined,
            undefined,
            true
        )[0],
        tooltipSuffix: '°F'
    }
];
