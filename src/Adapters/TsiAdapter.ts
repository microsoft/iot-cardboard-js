import TsqExpression from 'tsiclient/TsqExpression';
import ServerClient from 'tsiclient/ServerClient';
import IBaseAdapter from './IBaseAdapter';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IAuthService } from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import { transformTsqResultsForVisualization } from '../Models/Services/Utils';

export default class TsiAdapter implements IBaseAdapter {
    private authService: IAuthService;
    private environmentFqdn: string;

    constructor(environmentFqdn: string, authService: IAuthService) {
        this.environmentFqdn = environmentFqdn;
        this.authService = authService;
        this.authService.login();
    }

    async getKeyValuePairs(
        id: string,
        properties: string[],
        additionalParameters?: Record<string, any>
    ) {
        console.log(id + properties + additionalParameters);
        throw new Error('Method not implemented.');
        return new AdapterResult<KeyValuePairAdapterData>({
            result: null,
            error: null
        });
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        try {
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

            const token = await this.authService.getToken();

            const tsqResults = await new ServerClient().getTsqResults(
                token,
                this.environmentFqdn,
                tsqExpressions.map((tsqe) => tsqe.toTsq())
            );

            const transformedResults = transformTsqResultsForVisualization(
                tsqResults,
                tsqExpressions
            ) as any;

            return new AdapterResult<TsiClientAdapterData>({
                result: new TsiClientAdapterData(transformedResults),
                error: null
            });
        } catch (err) {
            return new AdapterResult<TsiClientAdapterData>({
                result: null,
                error: err
            });
        }
    }
}
