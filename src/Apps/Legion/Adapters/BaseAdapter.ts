import { IAuthService } from '../../../Models/Constants';
import { IBaseAdapter } from '../Models/Interfaces';

export default class BaseAdapter implements IBaseAdapter {
    protected authService: IAuthService;

    constructor(authService?: IAuthService) {
        this.authService = authService;
    }
}
