import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { CreatableProps } from 'react-select/creatable';
import { GroupBase } from 'react-select';
import { IReactSelectOption } from '../../Models';
import { ITooltipCalloutProps } from '../../../../Components/TooltipCallout/TooltipCallout.types';

export type CreatableInternalProps<T> = Omit<
    CreatableProps<T, boolean, GroupBase<T>>,
    'options' | 'styles'
>;
export interface ICardboardComboBoxProps<T extends IReactSelectOption>
    extends CreatableInternalProps<T> {
    /** text below the dropdown */
    description?: string;
    /** indicates that the text under the dropdown is an error so it shows as red */
    descriptionIsError?: boolean;
    /** text above the dropdown */
    label: string;
    /** callback when selection changes */
    onSelectionChange: (item: T, isNew: boolean) => void;
    options: T[];
    /** placeholder text inside the control before a selection is made */
    placeholder: string;
    /** is the field required? Shows the red * in the label */
    required?: boolean;
    /** the item to use as the selected item */
    selectedItem: T | undefined;
    tooltip?: ITooltipCalloutProps;
    /** to decide to render it as combobox or dropdown */
    isCreatable?: boolean;
    /** to specify create label if it is creatable */
    formatCreateLabel?: (inputValue: string) => React.ReactNode;
    /** to show spinner to show a separate state that combobix is working on like adapter action on create a new option */
    isSpinnerVisible?: boolean;
    /** label to show next to spinner if enabled */
    spinnerLabel?: string;
}

export interface ICardboardComboBoxStyleProps {
    theme: IExtendedTheme;
    isDescriptionError: boolean;
}
