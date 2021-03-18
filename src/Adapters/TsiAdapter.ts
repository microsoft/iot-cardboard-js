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
import AdapterErrorManager from '../Models/Classes/AdapterErrorManager';
import { AdapterErrorType } from '..';
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
        _id: string,
        _properties: string[],
        _additionalParameters?: Record<string, any>
    ) {
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

        return await errorManager.sandboxAdapterExecution(async () => {
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

            const transformedResults = transformTsqResultsForVisualization(
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
