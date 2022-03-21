export interface IValidityState {
    isValid: boolean;
}
export type TabNames = 'Alerts' | 'Elements' | 'State' | 'Widgets';
export interface IBehaviorFormState {
    validityMap: Map<TabNames, IValidityState>;
}

export enum BehaviorFormActionType {
    SET_TAB_STATE
}

export type BehaviorFormAction = {
    type: BehaviorFormActionType.SET_TAB_STATE;
    payload: {
        tabName: TabNames;
        isValid: boolean;
    };
};
