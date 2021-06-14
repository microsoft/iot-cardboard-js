import { IBaseStandardModelSearchAdapter } from '../Constants';
import { modelActionType } from '../Constants/Enums';
import {
    StandardModelData,
    StandardModelIndexData
} from './AdapterDataClasses/StandardModelData';
import AdapterMethodSandbox from './AdapterMethodSandbox';

class BaseStandardModelSearchAdapter
    implements IBaseStandardModelSearchAdapter {
    public CdnUrl: string;

    constructor(CdnUrl: string) {
        this.CdnUrl = CdnUrl;
    }

    async getModelSearchIndex() {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            let modelSearchStringIndex: string[] = [];
            let modelSearchIndexObj: any = {};

            let res = await fetch(`${this.CdnUrl}/index.json`);
            let json = await res.json();

            modelSearchIndexObj = json.models;

            let models: string[] = [];
            models = this.parseModelsIntoArray(json.models);

            modelSearchStringIndex = [...modelSearchStringIndex, ...models];

            while (json.links?.next) {
                res = await fetch(`${this.CdnUrl}/${json.links.next}`);
                json = await res.json();
                models = this.parseModelsIntoArray(json.models);
                modelSearchStringIndex = [...modelSearchStringIndex, ...models];
                modelSearchIndexObj = {
                    ...modelSearchIndexObj,
                    ...json.models
                };
            }

            return new StandardModelIndexData({
                modelSearchIndexObj,
                modelSearchStringIndex
            });
        });
    }

    async fetchModelJsonFromCDN(dtmi: string, actionType: modelActionType) {
        const adapterSandbox = new AdapterMethodSandbox();
        return await adapterSandbox.safelyFetchData(async () => {
            const modelPath =
                dtmi.replaceAll(':', '/').replaceAll(';', '-').toLowerCase() +
                '.expanded.json';
            const res = await fetch(`${this.CdnUrl}/` + modelPath);

            const json = await res.json();

            return new StandardModelData({ json, actionType });
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

export default BaseStandardModelSearchAdapter;
