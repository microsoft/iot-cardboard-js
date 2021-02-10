import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import MsalAuthService from '../Helpers/MsalAuthService';
import TsqExpression from 'tsiclient/TsqExpression';
import ServerClient from 'tsiclient/ServerClient';
import UxClient from 'tsiclient/UXClient';
import { SearchSpan } from '../Models/SearchSpan';
import { IBaseAdapter } from './IBaseAdapter';

export default class AdtAdapter implements IBaseAdapter {
    private authService: MsalAuthService;
    private environmentFqdn: string;

    constructor(
        environmentFqdn: string,
        authService: MsalAuthService = new MsalAuthService()
    ) {
        this.environmentFqdn = environmentFqdn;
        this.authService = authService;
        this.authService.login();
    }

    getLineChartData(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ): Promise<LineChartData> {
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
                { timeSeriesId: id },
                variableObject,
                searchSpan,
                null
            );
            tsqExpressions.push(tsqExpression);
        });

        return new Promise((resolve) => {
            this.authService.getToken().then((token) => {
                (new ServerClient().getTsqResults(
                    token,
                    this.environmentFqdn,
                    tsqExpressions.map((tsqe) => tsqe.toTsq())
                ) as Promise<[]>).then((results: []) => {
                    const transformedResults = new UxClient().transformTsqResultsForVisualization(
                        results,
                        tsqExpressions
                    );
                    resolve({ data: transformedResults });
                });
            });
        });
    }
}
