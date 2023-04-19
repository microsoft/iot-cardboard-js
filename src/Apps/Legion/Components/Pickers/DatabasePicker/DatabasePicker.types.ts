import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../Theming/Theme.types';
import { ADXAdapterTargetContext } from '../../../Models/Types';

export interface IDatabasePickerProps {
    selectedDatabaseName?: string;
    onDatabaseNameChange?: (databaseName: string, isNew?: boolean) => void;
    targetAdapterContext?: ADXAdapterTargetContext;
    isCreatable?: boolean;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDatabasePickerStyleProps,
        IDatabasePickerStyles
    >;
}

export interface IDatabasePickerStyleProps {
    theme: IExtendedTheme;
}
export interface IDatabasePickerStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDatabasePickerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDatabasePickerSubComponentStyles {}
