import { LineChartData } from '../Cards/Linechart/Consume/LinechartCard.types';
import TsqExpression from 'tsiclient/TsqExpression';
import ServerClient from 'tsiclient/ServerClient';
import UxClient from 'tsiclient/UXClient';
import { IBaseAdapter } from './IBaseAdapter';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IAuthService } from '../Models/Constants/Interfaces';

export default class TsiAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private environmentFqdn: string;

    constructor(environmentFqdn: string, authService: IAuthService) {
        this.environmentFqdn = environmentFqdn;
        this.authService = authService;
        this.authService.login();
    }

    getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters?: Record<string, any>
    ): Promise<Record<string, any>> {
        console.log(id + properties + additionalParameters);
        throw new Error('Method not implemented.');
    }

    getTsiclientChartDataShape(
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
                { timeSeriesId: [id] },
                variableObject,
                searchSpan,
                { alias: prop }
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
