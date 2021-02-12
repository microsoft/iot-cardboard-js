export default class MsalAuthService implements IAuthService {
    private getTokenCalls;
    private gettingToken;
    private isLoggingIn;
    private executeGetTokenSequentially;
    private authContextConfig;
    private authContext;
    environmentToConstantMapping: EnvironmentToConstantMapping;
    constructor(environmentToConstantMapping?: EnvironmentToConstantMapping);
    login: () => void;
    logout: () => void;
    private shiftAndExecuteGetTokenCall;
    private createGetTokenCall;
    private getGenericTokenPromiseCallback;
    getToken: () => Promise<string>;
}
interface IAuthService {
    login(): void;
    getToken: () => Promise<string>;
    environmentToConstantMapping: EnvironmentToConstantMapping;
}
interface EnvironmentToConstantMapping {
    authority: string;
    clientId: string;
    scope: string;
    redirectUri: string;
}
export {};
