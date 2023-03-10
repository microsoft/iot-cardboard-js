import {
    AccountInfo,
    AuthenticationResult,
    Configuration,
    EndSessionRequest,
    InteractionRequiredAuthError,
    PopupRequest,
    PublicClientApplication,
    RedirectRequest,
    SsoSilentRequest
} from '@azure/msal-browser';
import { AuthTokenTypes } from '../Constants/Enums';
import {
    IMSALLoginContinuationParams,
    IAuthParams,
    IAuthService
} from '../Constants/Interfaces';

export const DEFAULT_TENANT_ID = 'common';
export default class MsalAuthService implements IAuthService {
    private MSALConfig: Configuration;
    private MSALObj: PublicClientApplication;
    private authParams: IAuthParams;
    private tenantId: string;
    private targetTenantId: string;
    private userObjectId: string;
    private loginPopupRequest: PopupRequest;
    private loginRedirectRequest: RedirectRequest;

    private getTokenCalls = [];
    private gettingToken = false;
    private isLoggingIn = true;
    private executeGetTokenSequentially = true;

    private apiEndpoints = {
        tsi: 'https://api.timeseries.azure.com',
        management: 'https://management.azure.com',
        adx: 'https://help.kusto.windows.net',
        adt: 'https://digitaltwins.azure.net',
        storage: 'https://storage.azure.com',
        powerBI: 'https://analysis.windows.net/powerbi/api'
    };

    constructor(authParams: IAuthParams) {
        this.authParams = authParams;
        this.targetTenantId = authParams.tenantId;
        this.tenantId = DEFAULT_TENANT_ID;

        this.MSALConfig = {
            auth: {
                clientId: this.authParams.clientId,
                authority: `${this.authParams.login}${this.tenantId}`,
                redirectUri: `${window.location.protocol}//${window.location.hostname}`,
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        };
        this.MSALObj = new PublicClientApplication(this.MSALConfig);

        this.loginPopupRequest = {
            scopes: []
        };
        this.loginRedirectRequest = {
            ...this.loginPopupRequest,
            redirectStartPage: window.location.href,
            prompt: 'select_account'
        };
    }

    login = (continuation?: (params: IMSALLoginContinuationParams) => void) => {
        this.isLoggingIn = true;

        const getTenantsAndContinuation = (name, userName, accounts) => {
            this.getManagementToken(true).then((token) => {
                this.promiseHttpRequest(
                    token,
                    `https://management.azure.com/tenants?api-version=2020-01-01`,
                    {},
                    'GET'
                )
                    .then((tenants: any) => {
                        let resolvedTenants;
                        try {
                            const responsePayload = JSON.parse(tenants);
                            resolvedTenants = responsePayload.value;
                        } catch (err) {
                            resolvedTenants = [];
                            console.log(err);
                        }
                        continuation?.({
                            name,
                            userName,
                            tenants: resolvedTenants,
                            accounts
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        continuation?.({
                            name,
                            userName,
                            tenants: [],
                            accounts
                        });
                    });
            });
        };

        this.MSALObj.handleRedirectPromise().then(
            (resp: AuthenticationResult | null) => {
                if (resp !== null) {
                    this.isLoggingIn = false;
                    const activeAccount = resp.account;
                    this.setActiveAccount(activeAccount);
                    if (continuation) {
                        getTenantsAndContinuation(
                            activeAccount.name,
                            activeAccount.username,
                            [activeAccount]
                        );
                    } else {
                        this.ssoSilent(activeAccount.username);
                    }
                    for (let i = 0; i < this.getTokenCalls.length; i++) {
                        this.shiftAndExecuteGetTokenCall();
                    }
                } else {
                    this.isLoggingIn = false;
                    const allAccounts = this.MSALObj.getAllAccounts();
                    if (!allAccounts || allAccounts.length < 1) {
                        this.MSALObj.loginRedirect(this.loginRedirectRequest);
                    } else {
                        let activeAccount;
                        if (this.tenantId === DEFAULT_TENANT_ID) {
                            if (
                                this.targetTenantId &&
                                this.targetTenantId !== DEFAULT_TENANT_ID
                            ) {
                                activeAccount = allAccounts.find(
                                    (a: any) =>
                                        a.tenantId === this.targetTenantId
                                );
                            } else {
                                activeAccount = allAccounts[0];
                            }
                        } else {
                            activeAccount = allAccounts.find(
                                (a: any) => a.tenantId === this.tenantId
                            );
                        }
                        this.setActiveAccount(activeAccount);
                        if (continuation) {
                            getTenantsAndContinuation(
                                activeAccount.name,
                                activeAccount.username,
                                allAccounts
                            );
                        } else {
                            this.ssoSilent(activeAccount.username);
                        }
                        for (let i = 0; i < this.getTokenCalls.length; i++) {
                            this.shiftAndExecuteGetTokenCall();
                        }
                    }
                }
            }
        );
    };

    logout = () => {
        const account: AccountInfo =
            this.MSALObj.getActiveAccount() ?? undefined;
        const logOutRequest: EndSessionRequest = {
            account
        };

        this.MSALObj.logoutRedirect(logOutRequest);
    };

    getUserObjectId = () => {
        return this.userObjectId;
    };

    setActiveAccount = (account: AccountInfo) => {
        this.MSALObj.setActiveAccount(account);
        this.tenantId = account?.tenantId || DEFAULT_TENANT_ID;
        this.userObjectId = account?.idTokenClaims['oid'];
    };

    private shiftAndExecuteGetTokenCall = () => {
        const call = this.getTokenCalls.shift();
        if (call) {
            call.call();
        }
    };

    private createGetTokenCall = (
        scope,
        resolve,
        reject,
        allowParallelGetTokenAfterComplete
    ) => {
        const resolveToken = ({ accessToken }) => {
            if (allowParallelGetTokenAfterComplete) {
                this.executeGetTokenSequentially = false;
            }
            this.gettingToken = false;
            resolve(accessToken);
            this.shiftAndExecuteGetTokenCall();
        };

        return () => {
            this.gettingToken = true;
            this.MSALObj.acquireTokenSilent(scope)
                .then(resolveToken)
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        // popups are likely to be blocked by the browser
                        // notify the user that they should enable them
                        alert(
                            'Some authentication flows will require pop-ups, please make sure popups are enabled for this site.'
                        );
                        this.MSALObj.acquireTokenPopup(scope)
                            .then(resolveToken)
                            .catch((error) => {
                                console.error(error);
                                resolveToken(error);
                            });
                    } else if (
                        error &&
                        error.errorCode &&
                        error.errorCode === 'no_tokens_found'
                    ) {
                        this.MSALObj.logoutRedirect({
                            onRedirectNavigate: (_url) => {
                                // Return false if you would like to stop navigation after local logout
                                return false;
                            }
                        }).then(() => location.reload());
                    } else {
                        console.error(error);
                        resolveToken(error);
                    }
                });
        };
    };

    private getGenericTokenPromiseCallback = (
        scope,
        allowParallelGetTokenAfterComplete = false
    ) => {
        if (this.tenantId !== DEFAULT_TENANT_ID && !scope.authority) {
            scope.authority = `${this.authParams.login}${this.tenantId}`;
        }
        return (resolve, reject) => {
            const getTokenCall = this.createGetTokenCall(
                scope,
                resolve,
                reject,
                allowParallelGetTokenAfterComplete
            );
            this.getTokenCalls.push(getTokenCall);
            if (
                (!this.gettingToken || !this.executeGetTokenSequentially) &&
                !this.isLoggingIn
            ) {
                this.shiftAndExecuteGetTokenCall();
            }
        };
    };

    getToken = (
        tokenFor: AuthTokenTypes,
        useLoginAuthority = false
    ): Promise<string> => {
        let promise: Promise<string>;
        switch (tokenFor) {
            case AuthTokenTypes.management:
                promise = this.getManagementToken(useLoginAuthority);
                break;
            case AuthTokenTypes.adx:
                promise = this.getAdxToken();
                break;
            case AuthTokenTypes.adt:
                promise = this.getAdtToken();
                break;
            case AuthTokenTypes.storage:
                promise = this.getStorageToken();
                break;
            case AuthTokenTypes.powerBI:
                promise = this.getPowerBIToken();
                break;
            default:
                promise = this.getAdtToken();
                break;
        }
        return promise as Promise<string>;
    };

    private getAdtToken = (): Promise<string> => {
        const adtApiEndpoint = this.apiEndpoints.adt;
        return new Promise(
            this.getGenericTokenPromiseCallback({
                scopes: [`${adtApiEndpoint}/.default`]
            })
        );
    };

    private getAdxToken = (): Promise<string> => {
        const adxApiEndpoint = this.apiEndpoints.adx;
        return new Promise(
            this.getGenericTokenPromiseCallback({
                scopes: [`${adxApiEndpoint}/user_impersonation`]
            })
        );
    };

    private getStorageToken = (): Promise<string> => {
        const storageApiEndpoint = this.apiEndpoints.storage;
        return new Promise(
            this.getGenericTokenPromiseCallback({
                scopes: [`${storageApiEndpoint}/user_impersonation`]
            })
        );
    };

    private getManagementToken = (
        useLoginAuthority = false
    ): Promise<string> => {
        const managementApiEndpoint = this.apiEndpoints.management;
        const scope = { scopes: [`${managementApiEndpoint}/.default`] };
        if (useLoginAuthority) {
            scope['authority'] = `${this.authParams.login}organizations`;
        }
        return new Promise(this.getGenericTokenPromiseCallback(scope));
    };

    private getPowerBIToken = (): Promise<string> => {
        const powerBIApiEndpoint = this.apiEndpoints.powerBI;
        const scope = { scopes: [`${powerBIApiEndpoint}/.default`] };
        return new Promise(this.getGenericTokenPromiseCallback(scope));
    };

    private promiseHttpRequest = (token, url, payload, verb = 'POST') =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (xhr.status === 200 || xhr.status === 202) {
                    if (xhr.responseText.length === 0) {
                        resolve({});
                    } else {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(xhr);
                }
            };
            xhr.open(verb, url);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(payload);
        });

    ssoSilent = (userName, continuation?: () => void) => {
        const request: SsoSilentRequest = {
            authority: `${this.authParams.login}${this.tenantId}`,
            loginHint: userName
        };
        const setAccountAndContinue = (response) => {
            if (response.account) {
                this.setActiveAccount(response.account);
            }
            continuation?.();
        };
        const catchLogic = (err) => {
            console.error('SSO failed');
            console.error(err);
            continuation?.();
        };
        this.MSALObj.ssoSilent(request)
            .then(setAccountAndContinue)
            .catch((err) => {
                if (err instanceof InteractionRequiredAuthError) {
                    alert(
                        'Some authentication flows will require pop-ups, please make sure popups are enabled for this site.'
                    );
                    this.MSALObj.loginPopup(this.loginPopupRequest)
                        .then(setAccountAndContinue)
                        .catch(catchLogic);
                } else {
                    catchLogic(err);
                }
            });
    };
}
