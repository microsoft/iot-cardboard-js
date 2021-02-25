import { Theme } from '../../../Models/Constants/Enums';

export interface LinechartCardCreateProps {
    theme: Theme;
    propertyNames: Array<string>;
    defaultState?: LinechartCardCreateState;
}

export interface LinechartCardCreateState {
    selectedPropertyNames: Array<string>;
    chartPropertyNames: Array<string>;
    title: string;
}

export interface LinechartCardCreateFormProps {
    propertyNames: Array<string>;
    onSubmit: any;
    setSelectedPropertyNames: any;
    selectedPropertyNames: Array<string>;
    setTitle: any;
    title: string;
}
