import { IAdapterData, IAzureResource } from '../../Constants/Interfaces';
import { AzureAccessPermissionRoleGroups } from '../../Constants/Types';

export class AzureResourcesData implements IAdapterData {
    data: Array<IAzureResource>;

    constructor(data: Array<IAzureResource>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export class AzureResourceData implements IAdapterData {
    data: IAzureResource;

    constructor(data: IAzureResource) {
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
