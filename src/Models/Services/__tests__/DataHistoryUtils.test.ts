import { cleanup } from '@testing-library/react-hooks';
import { IHighChartSeriesData } from '../../../Components/HighChartsWrapper/HighChartsWrapper.types';
import { ADXTimeSeries, IDataHistoryTimeSeriesTwin } from '../../Constants';
import { QuickTimeSpanKey } from '../../Constants/Enums';
import { CUSTOM_HIGHCHARTS_COLOR_IDX_1 } from '../../Constants/StyleConstants';
import {
    getHighChartColor,
    getQuickTimeSpanKeyByValue,
    transformADXTimeSeriesToHighChartsSeries
} from '../../SharedUtils/DataHistoryUtils';

afterEach(cleanup);

describe('DataHistoryUtils', () => {
    describe('getQuickTimeSpanKeyByValue', () => {
        test('given number in millisecond, it returns quick timespan key', () => {
            // ARRANGE
            const millis = 15 * 60 * 1000; // 15 minutes in milliseconds

            // ACT
            const result = getQuickTimeSpanKeyByValue(millis);

            // ASSERT
            expect(result).toBeDefined();
            expect(result).toEqual(QuickTimeSpanKey.Last15Mins);
        });
    });
    describe('getHighChartColor', () => {
        test('for a given index, returns HighCharts default color', () => {
            // ACT
            const result0 = getHighChartColor(0);
            const result1 = getHighChartColor(1);
            const result2 = getHighChartColor(2);

            // ASSERT
            expect(result0).toEqual('#7cb5ec');
            expect(result1).toEqual(CUSTOM_HIGHCHARTS_COLOR_IDX_1);
            expect(result2).toEqual('#90ed7d');
        });
    });
    describe('transformADXTimeSeriesToHighChartsSeries', () => {
        test('merge ADX data with authored time series object for chart to render', () => {
            // ARRANGE
            const adxData: Array<ADXTimeSeries> = [
                {
                    id: 'SaltMachine_C0',
                    key: 'InFlow',
                    data: [
                        { timestamp: 1340323200000, value: 115 },
                        { timestamp: 1340339499317, value: 23 },
                        { timestamp: 1340368246728, value: 188 },
                        { timestamp: 1340390085747, value: 213 },
                        { timestamp: 1340403271088, value: 245 }
                    ]
                }
            ];
            const timeSeries: Array<IDataHistoryTimeSeriesTwin> = [
                {
                    twinId: 'SaltMachine_C0',
                    twinPropertyName: 'InFlow',
                    twinPropertyType: 'double',
                    chartProps: { color: '#fffff' },
                    label: 'SaltMachine_C0 InFlow'
                }
            ];

            // ACT
            const result = transformADXTimeSeriesToHighChartsSeries(
                adxData,
                timeSeries
            );

            // ASSERT
            expect(result).toMatchObject([
                {
                    name: 'SaltMachine_C0 InFlow',
                    data: [
                        { timestamp: 1340323200000, value: 115 },
                        { timestamp: 1340339499317, value: 23 },
                        { timestamp: 1340368246728, value: 188 },
                        { timestamp: 1340390085747, value: 213 },
                        { timestamp: 1340403271088, value: 245 }
                    ],
                    color: '#fffff'
                } as IHighChartSeriesData
            ]);
        });
    });
});
