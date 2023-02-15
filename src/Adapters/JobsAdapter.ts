import ADTJobsData from '../Models/Classes/AdapterDataClasses/ADTJobsData';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import {
    AdapterMethodParamsForJobs,
    ADT_ApiVersion,
    AxiosObjParam,
    IAuthService,
    IJobsAdapter,
    LOCAL_STORAGE_KEYS
} from '../Models/Constants';
import { applyMixins, validateExplorerOrigin } from '../Models/Services/Utils';
import ADT3DSceneAdapter from './ADT3DSceneAdapter';
import ADTAdapter from './ADTAdapter';

export default class JobsAdapter implements IJobsAdapter {
    public adtHostUrl: string;
    public authService: IAuthService;
    public uniqueObjectId: string;
    public tenantId: string;
    protected useProxy: boolean;
    protected adtProxyServerPath: string;

    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        adtProxyServerPath = '/proxy/adt',
        useProxy = true
    ) {
        this.setAdtHostUrl(adtHostUrl); // this should be the host name of the instance
        this.adtProxyServerPath = adtProxyServerPath;
        this.authService = authService;
        /**
         * Check if class has been initialized with CORS enabled or if origin matches dev or prod explorer urls,
         * override if proxy is forced by feature flag
         *  */
        this.useProxy =
            useProxy ||
            !validateExplorerOrigin(window.origin) ||
            localStorage.getItem(
                LOCAL_STORAGE_KEYS.FeatureFlags.Proxy.forceProxy
            ) === 'true';
    }
    setAdtHostUrl(hostName: string) {
        if (hostName.startsWith('https://')) {
            hostName = hostName.replace('https://', '');
        }
        this.adtHostUrl = hostName;
    }
    generateUrl(path: string) {
        if (this.useProxy) {
            return `${this.adtProxyServerPath}${path}`;
        } else {
            return `https://${this.adtHostUrl}${path}`;
        }
    }
    generateHeaders(headers: AxiosObjParam = {}) {
        if (this.useProxy) {
            return {
                ...headers,
                'x-adt-host': this.adtHostUrl
            };
        } else {
            return headers;
        }
    }
    getAdtHostUrl() {
        return this.adtHostUrl;
    }

    async createJob(
        inputBlobUri: string,
        outputBlobUri: string,
        jobId: string
    ) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'put',
                url: this.generateUrl(`/jobs/${encodeURIComponent(jobId)}`),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion,
                    inputbloburi: inputBlobUri,
                    outputbloburi: outputBlobUri
                }
            }
        );
    }

    async deleteJob(params: AdapterMethodParamsForJobs) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'delete',
                url: this.generateUrl(`/jobs/${encodeURIComponent(params.jobId)}`),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    async cancelJob(params: AdapterMethodParamsForJobs) {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'post',
                url: this.generateUrl(`/jobs/${encodeURIComponent(params.jobId)}`),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }

    async getAllJobs() {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'get',
                url: this.generateUrl(`/jobs/imports`),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    }
}
export default interface JobsAdapter
    extends ADTAdapter,
    ADT3DSceneAdapter
applyMixins(JobsAdapter, [
    ADTAdapter,
    ADT3DSceneAdapter 
]);
