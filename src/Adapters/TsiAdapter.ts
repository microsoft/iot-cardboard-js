import TsqExpression from 'tsiclient/TsqExpression';
import ServerClient from 'tsiclient/ServerClient';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import {
    IAuthService,
    ITsiClientChartDataAdapter
} from '../Models/Constants/Interfaces';
import { TsiClientAdapterData } from '../Models/Classes';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import { ComponentErrorType } from '..';
import { transformTsqResultsForVisualization } from 'tsiclient/Transformers';

export default class TsiAdapter implements ITsiClientChartDataAdapter {
    private authService: IAuthService;
    private environmentFqdn: string;

    constructor(environmentFqdn: string, authService: IAuthService) {
        this.environmentFqdn = environmentFqdn;
        this.authService = authService;
        this.authService.login();
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return await adapterMethodSandbox.safelyFetchData(async (token) => {
            const tsqExpressions = [];
            properties.forEach((prop) => {
                const variableObject = {
                    [prop]: {
                        kind: 'numeric',
                        value: { tsx: `$event.${prop}.Double` },
                        filter: null,
                        aggregation: { tsx: 'avg($value)' }
                    }
                };
                const tsqExpression = new TsqExpression(
                    { timeSeriesId: [id] },
                    variableObject,
                    searchSpan,
                    { alias: prop }
                );
                tsqExpressions.push(tsqExpression);
            });

            let tsqResults;
            try {
                tsqResults = await new ServerClient().getTsqResults(
                    token,
                    this.environmentFqdn,
                    tsqExpressions.map((tsqe) => tsqe.toTsq())
                );
            } catch (err) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const transformedResults = transformTsqResultsForVisualization(
                tsqResults,
                tsqExpressions
            ) as any;

            return new TsiClientAdapterData(transformedResults);
        });
    }
}
