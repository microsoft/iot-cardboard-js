import { Theme } from '../../../Constants/Enums';

export interface LinechartCardCreateProps {
    theme: Theme;
    propertyNames: Array<string>;
    defaultState?: LinechartCardCreateState;
}

export interface LinechartCardCreateState {
    selectedPropertyNames: Array<string>;
    chartPropertyNames: Array<string>;
}

export interface LinechartCardCreateFormProps {
    propertyNames: Array<string>;
    onSubmit: any;
    setSelectedPropertyNames: any;
    selectedPropertyNames: Array<string>;
}
