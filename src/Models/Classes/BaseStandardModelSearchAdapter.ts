import { IBaseStandardModelSearchAdapter } from '../Constants';
import { modelActionType } from '../Constants/Enums';
import { StandardModelData } from './AdapterDataClasses/StandardModelData';
import AdapterMethodSandbox from './AdapterMethodSandbox';

class BaseStandardModelSearchAdapter
    implements IBaseStandardModelSearchAdapter {
    public CdnUrl: string;
    public modelSearchStringIndex: string[] = [];
    public modelSearchIndexObj: any = {};

    constructor(CdnUrl: string) {
        this.CdnUrl = CdnUrl;
        this.constructModelSearchIndex();
    }

    async constructModelSearchIndex() {
        let res = await fetch(`${this.CdnUrl}/index.json`);
        let json = await res.json();

        this.modelSearchIndexObj = json.models;

        let models: string[] = [];
        models = this.parseModelsIntoArray(json.models);
        this.modelSearchStringIndex = [
            ...this.modelSearchStringIndex,
            ...models
        ];

        while (json.links?.next) {
            res = await fetch(`${this.CdnUrl}/${json.links.next}`);
            json = await res.json();
            models = this.parseModelsIntoArray(json.models);
            this.modelSearchStringIndex = [
                ...this.modelSearchStringIndex,
                ...models
            ];
        }
    }

    async fetchModelJsonFromCDN(dtmi: string, actionType: modelActionType) {
        const adapterSandbox = new AdapterMethodSandbox();
        return await adapterSandbox.safelyFetchData(async () => {
            const modelPath =
                dtmi.replaceAll(':', '/').replaceAll(';', '-') +
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
