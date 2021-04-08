import React from 'react';
import Linechart from './Linechart/Linechart';
import Barchart from './Barchart/Barchart';
import MockAdapter from '../Adapters/MockAdapter';
import { mockedSearchSpan } from '../Models/Classes/SearchSpan';
import { TSIComponentTypes } from '../Models/Constants';
import { useTranslation } from 'react-i18next';
import I18nProviderWrapper from '../Models/Classes/I18NProviderWrapper';
import i18n from '../i18n';
export default {
    title: 'Components/Swapping components',
    argTypes: {
        chartType: {
            control: {
                type: 'select',
                options: [
                    TSIComponentTypes.Linechart,
                    TSIComponentTypes.Barchart
                ]
            }
        }
    }
};

const chartCardStyle = {
    height: '400px'
};

const mockAdapter = new MockAdapter();
const mockData = mockAdapter.generateMockLineChartData(mockedSearchSpan, [
    'foo'
]);

export const SwapLinechartAndBarchart = (
    args,
    { globals: { theme, locale } }
) => {
    const { t } = useTranslation();
    return (
        <I18nProviderWrapper locale={locale} i18n={i18n}>
            <div style={chartCardStyle}>
                {args.chartType === TSIComponentTypes.Linechart && (
                    <Linechart
                        data={mockData}
                        chartDataOptions={null}
                        chartOptions={{
                            theme: theme,
                            strings: t('sdkStrings', {
                                returnObjects: true
                            })
                        }}
                    />
                )}
                {args.chartType === TSIComponentTypes.Barchart && (
                    <Barchart
                        data={mockData}
                        chartDataOptions={null}
                        chartOptions={{
                            theme: theme,
                            strings: t('sdkStrings', {
                                returnObjects: true
                            })
                        }}
                    />
                )}
            </div>
        </I18nProviderWrapper>
    );
};

SwapLinechartAndBarchart.args = { chartType: TSIComponentTypes.Linechart };
