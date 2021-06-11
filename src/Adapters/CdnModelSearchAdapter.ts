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
    constructor(CdnUrl: string) {
        super(CdnUrl);
    }

    async searchString(queryString: string) {
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

            Object.keys(this.modelSearchIndexObj).forEach((key) => {
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
            });

            return new StandardModelSearchData({
                data: searchResults
            });
        });
    }
}
