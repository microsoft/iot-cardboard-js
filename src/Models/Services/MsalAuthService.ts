import * as Msal from '@azure/msal-browser';
import {
    IEnvironmentToConstantMapping,
    IAuthService
} from '../Constants/Interfaces';

export default class MsalAuthService implements IAuthService {
    private getTokenCalls = [];
    private gettingToken = false;
    private isLoggingIn = true;
    private executeGetTokenSequentially = true;
    private authContextConfig;
    private authContext;

    private environmentToConstantMapping: IEnvironmentToConstantMapping = {
        authority: 'https://login.microsoftonline.com/organizations',

        // valid redirect URI for this is client ID is https://adtexplorer-tsi-local.azurewebsites.net
        // modify hosts file accordingly
        clientId: 'e7e88070-28a1-43a3-9704-d8b986eb5f60',

        scope: 'https://api.timeseries.azure.com/.default',

        redirectUri: window.location.protocol + '//' + window.location.hostname

        // // The resource URI for ADT should NOT end with a trailing slash as it will cause
        // // authentication to fail.
        // scope: 'https://digitaltwins.azure.net/.default'
    };

    constructor(environmentToConstantMapping?: IEnvironmentToConstantMapping) {
        this.environmentToConstantMapping =
            environmentToConstantMapping || this.environmentToConstantMapping;

        this.authContextConfig = {
            auth: {
                clientId: this.environmentToConstantMapping.clientId,
                authority: `${this.environmentToConstantMapping.authority}`,
                redirectUri: this.environmentToConstantMapping.redirectUri,
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        };
        this.authContext = new Msal.PublicClientApplication(
            this.authContextConfig
        );
    }

    public login = () => {
        this.isLoggingIn = true;

        const accounts = this.authContext.getAllAccounts();
        if (accounts.length) {
            this.authContext.setActiveAccount(accounts[0]);
            this.isLoggingIn = false;
            this.shiftAndExecuteGetTokenCall();
        } else {
            this.authContext
                .loginPopup()
                .then(() => {
                    // In case multiple accounts exist, you can select
                    const currentAccounts = this.authContext.getAllAccounts();
                    this.authContext.setActiveAccount(currentAccounts[0]);
                    this.isLoggingIn = false;
                    this.shiftAndExecuteGetTokenCall();
                })
                .catch(function (error) {
                    //login failure
                    alert(error);
                });
        }
    };

    private logout = () => {
        this.authContext.logout();
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
            this.authContext
                .acquireTokenSilent(scope)
                .then(resolveToken)
                .catch((error) => {
                    if (error instanceof Msal.InteractionRequiredAuthError) {
                        // popups are likely to be blocked by the browser
                        // notify the user that they should enable them
                        alert(
                            'Some authentication flows will require pop-ups, please make sure popups are enabled for this site.'
                        );
                        this.authContext
                            .acquireTokenPopup(scope)
                            .then(resolveToken)
                            .catch((error) => {
                                console.error(error);
                                resolveToken(error);
                            });
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
        scope.authority = `${this.environmentToConstantMapping.authority}`;
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

    public getToken = (
        tokenFor?: 'azureManagement' | 'adx' | 'storage' | 'powerBI'
    ) => {
        let scope;
        switch (tokenFor) {
            case 'azureManagement':
                scope = 'https://management.azure.com//.default';
                return new Promise(
                    this.getGenericTokenPromiseCallback(
                        {
                            scopes: [scope]
                        },
                        true
                    )
                ) as Promise<string>;
            case 'adx':
                scope = 'https://help.kusto.windows.net/user_impersonation';
                return new Promise(
                    this.getGenericTokenPromiseCallback(
                        {
                            scopes: [scope]
                        },
                        true
                    )
                ) as Promise<string>;
            case 'storage':
                scope = 'https://storage.azure.com/user_impersonation';
                return new Promise(
                    this.getGenericTokenPromiseCallback(
                        {
                            scopes: [scope]
                        },
                        true
                    )
                ) as Promise<string>;
            case 'powerBI':
                scope = 'https://analysis.windows.net/powerbi/api/.default';
                return new Promise(
                    this.getGenericTokenPromiseCallback(
                        {
                            scopes: [scope]
                        },
                        true
                    )
                ) as Promise<string>;
            default:
                scope = this.environmentToConstantMapping.scope;
                return new Promise(
                    this.getGenericTokenPromiseCallback({
                        scopes: [scope]
                    })
                ) as Promise<string>;
        }
    };
}
