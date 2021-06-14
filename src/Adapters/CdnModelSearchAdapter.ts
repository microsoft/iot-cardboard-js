import { AdapterMethodSandbox } from '../Models/Classes';
import { StandardModelSearchData } from '../Models/Classes/AdapterDataClasses/StandardModelData';

import BaseStandardModelSearchAdapter from '../Models/Classes/BaseStandardModelSearchAdapter';
import {
    IModelSearchStringParams,
    IStandardModelSearchAdapter,
    IStandardModelSearchItem
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
            const keysAdded = {};
            const searchResults: IStandardModelSearchItem[] = [];

            const addItemToResults = (key: string) => {
                if (!(key in keysAdded)) {
                    searchResults.push({
                        dtmi: key,
                        ...(typeof modelIndex[key]?.displayName ===
                            'string' && {
                            displayName: modelIndex[key].displayName
                        }),
                        ...(typeof modelIndex[key]?.description ===
                            'string' && {
                            description: modelIndex[key].description
                        })
                    });
                    keysAdded[key] = true;
                }
            };

            const modelSearchIndexKeys = Object.keys(modelIndex);
            let nextPageStartingIndex = pageIdx;

            for (let i = pageIdx; i < modelSearchIndexKeys.length; i++) {
                const key = modelSearchIndexKeys[i];
                if (key.includes(queryString)) {
                    addItemToResults(key);
                }
                if (
                    typeof modelIndex[key]?.displayName === 'string' &&
                    modelIndex[key].displayName.includes(queryString)
                ) {
                    addItemToResults(key);
                }
                if (
                    typeof modelIndex[key]?.description === 'string' &&
                    modelIndex[key].description.includes(queryString)
                ) {
                    addItemToResults(key);
                }
                nextPageStartingIndex = i;
                if (searchResults.length >= this.pageSize) {
                    break;
                }
            }

            return new StandardModelSearchData({
                data: searchResults,
                metadata: {
                    pageIdx: nextPageStartingIndex,
                    hasMoreItems:
                        nextPageStartingIndex < modelSearchIndexKeys.length - 1
                }
            });
        });
    }
}
