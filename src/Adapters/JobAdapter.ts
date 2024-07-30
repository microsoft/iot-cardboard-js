import {
    AdapterCreateJobArgs,
    AdapterMethodParamsForJobs,
    IAuthService,
    IJobsAdapter,
    LOCAL_STORAGE_KEYS
} from '../Models/Constants';
import { applyMixins, validateExplorerOrigin } from '../Models/Services/Utils';
import ADT3DSceneAdapter from './ADT3DSceneAdapter';

const forceCORS = localStorage.getItem(
    LOCAL_STORAGE_KEYS.FeatureFlags.Proxy.forceCORS
);

export default class JobAdapter implements IJobsAdapter {
    public adtHostUrl: string;
    public authService: IAuthService;
    public uniqueObjectId: string;
    public tenantId: string;
    protected useAdtProxy: boolean;
    protected adtProxyServerPath: string;

    constructor(
        adtHostUrl: string,
        authService: IAuthService,
        adtProxyServerPath = '/proxy/adt',
        useAdtProxy = true,
        tenantId?: string,
        uniqueObjectId?: string
    ) {
        this.setAdtHostUrl(adtHostUrl); // this should be the host name of the instance
        this.adtProxyServerPath = adtProxyServerPath;
        this.authService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        /**
         * Check if class has been initialized with CORS enabled or if origin matches dev or prod explorer urls,
         * override if CORS is forced by feature flag
         *  */
        this.useAdtProxy =
            (useAdtProxy || !validateExplorerOrigin(window.origin)) &&
            !forceCORS;

        this.authService.login();
    }

    createJob = async (params: AdapterCreateJobArgs) => {
        console.log(params);
        return null;
    };

    deleteJob = async (params: AdapterMethodParamsForJobs) => {
        console.log(params);
        return null;
    };

    cancelJob = async (params: AdapterMethodParamsForJobs) => {
        console.log(params);
        return null;
    };

    getAllJobs = async () => {
        console.log();
        return null;
    };
}
export default interface JobAdapter extends ADT3DSceneAdapter {
    getAllJobs: () => Promise<any>;
    cancelJob: (params: AdapterMethodParamsForJobs) => Promise<any>;
    deleteJob: (params: AdapterMethodParamsForJobs) => Promise<any>;
    createJob: (params: AdapterCreateJobArgs) => Promise<any>;
}
applyMixins(JobAdapter, [ADT3DSceneAdapter]);
