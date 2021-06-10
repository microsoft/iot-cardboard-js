import { AdapterMethodSandbox } from '../Models/Classes';
import {
    StandardModelData,
    GithubModelSearchData,
    StandardModelIndexData
} from '../Models/Classes/AdapterDataClasses/StandardModelData';
import { modelActionType } from '../Models/Constants/Enums';
import { IStandardModelSearchAdapter } from '../Models/Constants/Interfaces';

export default class StandardModelSearchAdapter
    implements IStandardModelSearchAdapter {
    async searchStringInRepo(queryString: string) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const res = await fetch(
                `https://api.github.com/search/code?q=` + queryString
            );
            const rateLimitRemaining = Number(
                res.headers.get('x-ratelimit-remaining')
            );
            const rateLimitReset = Number(res.headers.get('x-ratelimit-reset'));
            const json = await res.json();
            return new GithubModelSearchData({
                ...json,
                rateLimitRemaining,
                rateLimitReset
            });
        });
    }

    async fetchModelJsonFromCDN(
        modelPath: string,
        actionType: modelActionType
    ) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const res = await fetch(
                `https://devicemodels.azure.com/` + modelPath
            );
            const json = await res.json();
            return new StandardModelData({ json, actionType });
        });
    }

    async fetchModelIndexFromCDN() {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            let stringIndex = [];
            let res = await fetch(`https://devicemodels.azure.com/index.json`);
            let json = await res.json();
            let models: string[] = [];

            models = this.parseModelsIntoArray(json.models);
            stringIndex = [...stringIndex, ...models];

            while (json.links?.next) {
                res = await fetch(
                    `https://devicemodels.azure.com/${json.links.next}`
                );
                json = await res.json();
                models = this.parseModelsIntoArray(json.models);
                stringIndex = [...stringIndex, ...models];
            }

            return new StandardModelIndexData(stringIndex);
        });
    }

    parseModelsIntoArray(models) {
        const index = [];
        Object.keys(models).forEach((key) => {
            index.push(key);
            if (
                models[key]?.displayName &&
                typeof models[key].displayName === 'string'
            ) {
                index.push(models[key].displayName);
            }
            if (
                models[key]?.description &&
                typeof models[key]?.description === 'string'
            ) {
                index.push(models[key].description);
            }
        });
        return index;
    }
}
