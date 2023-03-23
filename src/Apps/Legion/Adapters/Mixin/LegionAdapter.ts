import { ADXAdapter } from '../../../../Adapters';
import { IAuthService } from '../../../../Models/Constants/Interfaces';
import { applyMixins } from '../../../../Models/Services/Utils';
import MockDataManagementAdapter from '../Standalone/DataManagement/MockDataManagementAdapter';

export default class LegionAdapter {
    constructor(authService: IAuthService) {
        this.authService = authService;
    }
}

export default interface LegionAdapter
    extends ADXAdapter,
        MockDataManagementAdapter {}
applyMixins(LegionAdapter, [ADXAdapter, MockDataManagementAdapter]);
