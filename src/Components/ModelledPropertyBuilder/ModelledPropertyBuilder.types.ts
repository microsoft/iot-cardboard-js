import { IIntellisenseProps } from '../AutoComplete/Intellisense';
import { ITwinPropertyDropdownProps } from './Internal/TwinPropertyDropdown';

export type ModelledPropertyBuilderMode =
    | 'PROPERTY_SELECTION'
    | 'INTELLISENSE'
    | 'TOGGLE';

export type PropertySelectionModeProps = {
    mode: 'PROPERTY_SELECTION';
    twinPropertyDropdownProps: ITwinPropertyDropdownProps;
};

export type IntellisenseModeProps = {
    mode: 'INTELLISENSE';
    intellisenseProps: IIntellisenseProps;
};

export type ToggleModeProps = {
    mode: 'TOGGLE';
    twinPropertyDropdownProps: ITwinPropertyDropdownProps;
    intellisenseProps: IIntellisenseProps;
};

export type ModelledPropertyBuilderProps =
    | PropertySelectionModeProps
    | IntellisenseModeProps
    | ToggleModeProps;
