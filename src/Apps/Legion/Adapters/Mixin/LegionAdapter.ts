import { IAuthService } from '../../../../Models/Constants/Interfaces';
import { applyMixins } from '../../../../Models/Services/Utils';
import ADXAdapter from '../Standalone/DataManagement/ADXAdapter';

export default class LegionAdapter {
    constructor(authService: IAuthService, connectionSource: string) {
        this.authService = authService;
        this.connectionSource = connectionSource;
        this.authService.login();
    }
}

export default interface LegionAdapter extends ADXAdapter {
    additionalFunc: () => void;
}
applyMixins(LegionAdapter, [ADXAdapter]);
