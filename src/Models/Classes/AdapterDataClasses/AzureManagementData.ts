import {
    IAdapterData,
    IAzureResource,
    IAzureSubscription
} from '../../Constants/Interfaces';
import { AzureAccessPermissionRoleGroups } from '../../Constants/Types';

export class AzureSubscriptionData implements IAdapterData {
    data: Array<IAzureSubscription>;

    constructor(data: Array<IAzureSubscription>) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class AzureResourcesData implements IAdapterData {
    data: Array<IAzureResource>;

    constructor(data: Array<IAzureResource>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export class AzureMissingRoleDefinitionsData implements IAdapterData {
    data: AzureAccessPermissionRoleGroups;

    constructor(data: AzureAccessPermissionRoleGroups) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}
