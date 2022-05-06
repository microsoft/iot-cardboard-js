import {
    IAdapterData,
    IUserRoleAssignments,
    IUserSubscriptions
} from '../../Constants/Interfaces';

export class UserAssignmentsData implements IAdapterData {
    data: IUserRoleAssignments;

    constructor(data: IUserRoleAssignments) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export class SubscriptionData implements IAdapterData {
    data: IUserSubscriptions;

    constructor(data: IUserSubscriptions) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}
