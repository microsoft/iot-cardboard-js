import {
    IAdapterData,
    IAzureResource,
    IAzureRoleAssignment,
    IAzureUserRoleAssignments,
    IAzureUserSubscriptions
} from '../../Constants/Interfaces';
import {
    AzureResourceGroupsApiData,
    MissingAzureRoleDefinitionAssignments
} from '../../Constants/Types';

export class AzureUserAssignmentsData implements IAdapterData {
    data: IAzureUserRoleAssignments;

    constructor(data: IAzureUserRoleAssignments) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class AzureSubscriptionData implements IAdapterData {
    data: IAzureUserSubscriptions;

    constructor(data: IAzureUserSubscriptions) {
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

export class AzureRoleAssignmentsData implements IAdapterData {
    data: Array<IAzureRoleAssignment>;

    constructor(data: Array<IAzureRoleAssignment>) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class AzureResourceGroupsData implements IAdapterData {
    data: AzureResourceGroupsApiData;

    constructor(data: AzureResourceGroupsApiData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class AzureMissingRoleDefinitionsData implements IAdapterData {
    data: MissingAzureRoleDefinitionAssignments;

    constructor(data: MissingAzureRoleDefinitionAssignments) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}
