import TsqExpression from 'tsiclient/TsqExpression';
import ServerClient from 'tsiclient/ServerClient';
import UxClient from 'tsiclient/UXClient';
import IBaseAdapter from './IBaseAdapter';
import { SearchSpan } from '../Models/Classes/SearchSpan';
import { IAuthService } from '../Models/Constants/Interfaces';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    KeyValuePairAdapterData,
    TsiClientAdapterData
} from '../Models/Classes';
import AdapterErrorManager from '../Models/Classes/AdapterErrorManager';
import { AdapterErrorType } from '..';

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
            errorInfo: null
        });
    }

    async getTsiclientChartDataShape(
        id: string,
        searchSpan: SearchSpan,
        properties: string[]
    ) {
        const errorManager = new AdapterErrorManager();

        return errorManager.sandboxAdapterExecution(async () => {
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

            const token = await errorManager.sandboxFetchToken(
                this.authService
            );

            let tsqResults;
            try {
                tsqResults = await new ServerClient().getTsqResults(
                    token,
                    this.environmentFqdn,
                    tsqExpressions.map((tsqe) => tsqe.toTsq())
                );
            } catch (err) {
                errorManager.pushError({
                    type: AdapterErrorType.DataFetchFailed,
                    isCatastrophic: true,
                    rawError: err
                });
            }

            const transformedResults = new UxClient().transformTsqResultsForVisualization(
                tsqResults,
                tsqExpressions
            ) as any;

            return new AdapterResult<TsiClientAdapterData>({
                result: new TsiClientAdapterData(transformedResults),
                errorInfo: null
            });
        });
    }
}
