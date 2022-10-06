export interface IValidityState {
    isValid: boolean;
}
export type TabNames =
    | 'Root'
    | 'Twins'
    | 'Alerts'
    | 'Elements'
    | 'Status'
    | 'Widgets'
    | 'Rules';
export interface IBehaviorFormState {
    validityMap: Map<TabNames, IValidityState>;
}

export enum BehaviorFormActionType {
    SET_TAB_STATE,
    SET_IS_POPOVER_PREVIEW_VISIBLE
}

export type BehaviorFormAction =
    | {
          type: BehaviorFormActionType.SET_TAB_STATE;
          payload: {
              tabName: TabNames;
              state: IValidityState;
          };
      }
    | {
          type: BehaviorFormActionType.SET_IS_POPOVER_PREVIEW_VISIBLE;
          payload: boolean;
      };
