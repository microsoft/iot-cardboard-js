import { IAuthService } from '../../../../Models/Constants';

export default class PowerBIWidgetBuilderAdapter {
    authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }
}
