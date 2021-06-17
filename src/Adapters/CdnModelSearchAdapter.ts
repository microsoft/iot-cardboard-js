import { AdapterMethodSandbox } from '../Models/Classes';
import { StandardModelSearchData } from '../Models/Classes/AdapterDataClasses/StandardModelData';

import BaseStandardModelSearchAdapter from '../Models/Classes/BaseStandardModelSearchAdapter';
import ModelIndexSearchResultsBuilder from '../Models/Classes/ModelIndexSearchResultsBuilder';
import {
    IModelSearchStringParams,
    IStandardModelSearchAdapter
} from '../Models/Constants/Interfaces';

export default class CdnModelSearchAdapter
    extends BaseStandardModelSearchAdapter
    implements IStandardModelSearchAdapter {
    private pageSize: number;

    constructor(CdnUrl: string, pageSize = 10) {
        super(CdnUrl);
        this.pageSize = pageSize;
    }

    async searchString({
        modelIndex,
        pageIdx = 0,
        queryString
    }: IModelSearchStringParams) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const modelSearchIndexKeys = Object.keys(modelIndex);
            const builder = new ModelIndexSearchResultsBuilder(modelIndex);
            let nextPageStartingIndex = pageIdx;

            for (let i = pageIdx; i < modelSearchIndexKeys.length; i++) {
                const key = modelSearchIndexKeys[i];
                builder.addItemToResults(key, queryString);
                nextPageStartingIndex = i;
                if (builder.results.length >= this.pageSize) {
                    break;
                }
            }

            return new StandardModelSearchData({
                data: builder.results,
                metadata: {
                    pageIdx: nextPageStartingIndex,
                    hasMoreItems:
                        nextPageStartingIndex < modelSearchIndexKeys.length - 1
                }
            });
        });
    }
}
