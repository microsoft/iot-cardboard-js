import { AdapterMethodSandbox } from '../Models/Classes';
import { StandardModelSearchData } from '../Models/Classes/AdapterDataClasses/StandardModelData';

import BaseStandardModelSearchAdapter from '../Models/Classes/BaseStandardModelSearchAdapter';
import {
    IStandardModelSearchAdapter,
    StandardModelSearchItem
} from '../Models/Constants/Interfaces';

export default class CdnModelSearchAdapter
    extends BaseStandardModelSearchAdapter
    implements IStandardModelSearchAdapter {
    private pageSize: number;

    constructor(CdnUrl: string, pageSize = 10) {
        super(CdnUrl);
        this.pageSize = pageSize;
    }

    async searchString(queryString: string, pageIdx = 0) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const keysAdded = {};
            const searchResults: StandardModelSearchItem[] = [];

            const addItemToResults = (key: string) => {
                if (!(key in keysAdded)) {
                    searchResults.push({
                        dtmi: key,
                        ...(typeof this.modelSearchIndexObj[key]
                            ?.displayName === 'string' && {
                            displayName: this.modelSearchIndexObj[key]
                                .displayName
                        }),
                        ...(typeof this.modelSearchIndexObj[key]
                            ?.description === 'string' && {
                            description: this.modelSearchIndexObj[key]
                                .description
                        })
                    });
                    keysAdded[key] = true;
                }
            };

            const modelSearchIndexKeys = Object.keys(this.modelSearchIndexObj);
            let nextPageStartingIndex = pageIdx;

            for (let i = pageIdx; i < modelSearchIndexKeys.length; i++) {
                const key = modelSearchIndexKeys[i];
                if (key.includes(queryString)) {
                    addItemToResults(key);
                }
                if (
                    typeof this.modelSearchIndexObj[key]?.displayName ===
                        'string' &&
                    this.modelSearchIndexObj[key].displayName.includes(
                        queryString
                    )
                ) {
                    addItemToResults(key);
                }
                if (
                    typeof this.modelSearchIndexObj[key]?.description ===
                        'string' &&
                    this.modelSearchIndexObj[key].description.includes(
                        queryString
                    )
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
