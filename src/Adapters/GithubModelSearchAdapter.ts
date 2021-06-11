import { AdapterMethodSandbox } from '../Models/Classes';
import { StandardModelSearchData } from '../Models/Classes/AdapterDataClasses/StandardModelData';
import BaseStandardModelSearchAdapter from '../Models/Classes/BaseStandardModelSearchAdapter';
import { IStandardModelSearchAdapter } from '../Models/Constants/Interfaces';

export default class GithubModelSearchAdapter
    extends BaseStandardModelSearchAdapter
    implements IStandardModelSearchAdapter {
    private githubRepo: string;

    // Github Repo param should be in the form Organization/Repository,
    // example: Azure/iot-plugandplay-models
    constructor(CdnUrl: string, githubRepo: string) {
        super(CdnUrl);
        this.githubRepo = githubRepo;
    }

    async searchString(queryString: string) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const queryParam = encodeURIComponent(
                `${queryString} in:file,path path:dtmi extension:json repo:${this.githubRepo}`
            );

            const res = await fetch(
                `https://api.github.com/search/code?q=` + queryParam
            );
            const rateLimitRemaining = Number(
                res.headers.get('x-ratelimit-remaining')
            );
            const rateLimitReset = Number(res.headers.get('x-ratelimit-reset'));
            const json = await res.json();

            const results = json.items.map((item) => {
                return {
                    dtmi: item.path
                        .replaceAll('/', ':')
                        .replaceAll('-', ';')
                        .replace('.json', ''),
                    displayName: item.name
                };
            });

            return new StandardModelSearchData({
                data: results,
                metadata: {
                    rateLimitRemaining,
                    rateLimitReset
                }
            });
        });
    }
}
