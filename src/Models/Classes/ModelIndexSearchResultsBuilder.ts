import { IStandardModelSearchItem } from '../Constants/Interfaces';

class ModelIndexSearchResultsBuilder {
    results: IStandardModelSearchItem[] = [];
    keysAdded = {};
    modelIndex;

    constructor(modelIndex) {
        this.modelIndex = modelIndex;
    }

    private pushItem(indexKey: string) {
        if (!(indexKey in this.keysAdded)) {
            this.results.push({
                dtmi: indexKey,
                ...(typeof this.modelIndex[indexKey]?.displayName ===
                    'string' && {
                    displayName: this.modelIndex[indexKey].displayName
                }),
                ...(typeof this.modelIndex[indexKey]?.description ===
                    'string' && {
                    description: this.modelIndex[indexKey].description
                })
            });
            this.keysAdded[indexKey] = true;
        }
    }

    addItemToResults(indexKey: string, queryString: string) {
        if (indexKey.includes(queryString)) {
            this.pushItem(indexKey);
        }
        if (
            typeof this.modelIndex[indexKey]?.displayName === 'string' &&
            this.modelIndex[indexKey].displayName.includes(queryString)
        ) {
            this.pushItem(indexKey);
        }
        if (
            typeof this.modelIndex[indexKey]?.description === 'string' &&
            this.modelIndex[indexKey].description.includes(queryString)
        ) {
            this.pushItem(indexKey);
        }
    }
}

export default ModelIndexSearchResultsBuilder;
