import ADTJobsData from '../Models/Classes/AdapterDataClasses/ADTJobsData';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    AdapterMethodParamForCreateJobs,
    AdapterMethodParamsForJobs,
    ADT_ApiVersion,
    IAuthService,
    IJobsAdapter,
    LOCAL_STORAGE_KEYS
} from '../Models/Constants';
import { applyMixins, validateExplorerOrigin } from '../Models/Services/Utils';
import ADT3DSceneAdapter from './ADT3DSceneAdapter';

const forceCORS = localStorage.getItem(
    LOCAL_STORAGE_KEYS.FeatureFlags.Proxy.forceCORS
);

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
         * override if CORS is forced by feature flag
         *  */
        this.useProxy =
            (useProxy || !validateExplorerOrigin(window.origin)) && !forceCORS;
    }

    createJob = async (params: AdapterMethodParamForCreateJobs) => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'put',
                url: this.generateUrl(
                    `/jobs/${encodeURIComponent(params.jobId)}`
                ),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion,
                    inputbloburi: params.inputBlobUri,
                    outputbloburi: params.outputBlobUri
                }
            }
        );
    };

    deleteJob = async (params: AdapterMethodParamsForJobs) => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'delete',
                url: this.generateUrl(
                    `/jobs/${encodeURIComponent(params.jobId)}`
                ),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    };

    cancelJob = async (params: AdapterMethodParamsForJobs) => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);

        return adapterMethodSandbox.safelyFetchDataCancellableAxiosPromise(
            ADTJobsData,
            {
                method: 'post',
                url: this.generateUrl(
                    `/jobs/${encodeURIComponent(params.jobId)}`
                ),
                headers: this.generateHeaders(),
                params: {
                    'api-version': ADT_ApiVersion
                }
            }
        );
    };

    getAllJobs = async () => {
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
    };
}
export default interface JobsAdapter extends ADT3DSceneAdapter {
    getAllJobs: () => Promise<AdapterResult<any>>;
    cancelJob: (
        params: AdapterMethodParamsForJobs
    ) => Promise<AdapterResult<any>>;
    deleteJob: (
        params: AdapterMethodParamsForJobs
    ) => Promise<AdapterResult<any>>;
    createJob: (
        params: AdapterMethodParamForCreateJobs
    ) => Promise<AdapterResult<any>>;
}
applyMixins(JobsAdapter, [ADT3DSceneAdapter]);
