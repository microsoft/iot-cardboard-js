import { AdapterMethodSandbox } from '../Models/Classes';
import { StandardModelSearchData } from '../Models/Classes/AdapterDataClasses/StandardModelData';
import BaseStandardModelSearchAdapter from '../Models/Classes/BaseStandardModelSearchAdapter';
import {
    IModelSearchStringParams,
    IStandardModelSearchAdapter
} from '../Models/Constants/Interfaces';
import { parseLinkHeader } from '@web3-storage/parse-link-header';

export default class GithubModelSearchAdapter
    extends BaseStandardModelSearchAdapter
    implements IStandardModelSearchAdapter {
    public githubRepo: string;
    private pageSize: number;
    // Github Repo param should be in the form Organization/Repository,
    // example: Azure/iot-plugandplay-models
    constructor(CdnUrl: string, githubRepo: string, pageSize = 30) {
        super(CdnUrl);
        this.githubRepo = githubRepo;
        this.pageSize = pageSize;
    }

    async searchString({ queryString, pageIdx = 1 }: IModelSearchStringParams) {
        const adapterSandbox = new AdapterMethodSandbox();

        return await adapterSandbox.safelyFetchData(async () => {
            const queryParam = encodeURIComponent(
                `${queryString} in:file,path path:dtmi extension:json repo:${this.githubRepo}`
            );

            const res = await fetch(
                `https://api.github.com/search/code?q=` +
                    queryParam +
                    `&per_page=${this.pageSize}` +
                    `&page=${pageIdx}`
            );

            const rateLimitRemaining = Number(
                res.headers.get('x-ratelimit-remaining')
            );

            const rateLimitReset = Number(res.headers.get('x-ratelimit-reset'));
            const link = res.headers.get('link');
            const parsedLinkHeader = link ? parseLinkHeader(link) : null;
            const json = await res.json();

            const results = json?.items
                ? json.items.map((item) => {
                      return {
                          dtmi: item.path
                              .replaceAll('/', ':')
                              .replaceAll('-', ';')
                              .replace('.json', ''),
                          displayName: item.name
                      };
                  })
                : [];

            return new StandardModelSearchData({
                data: results,
                metadata: {
                    rateLimitRemaining,
                    rateLimitReset,
                    ...(parsedLinkHeader && {
                        pageIdx: parsedLinkHeader?.next?.page,
                        hasMoreItems: parsedLinkHeader?.next
                    })
                }
            });
        });
    }
}
