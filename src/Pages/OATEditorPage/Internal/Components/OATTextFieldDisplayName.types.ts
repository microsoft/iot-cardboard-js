import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { IOATTwinModelNodes } from '../../../../Models/Constants/Interfaces';

export type OATTextFieldDisplayNameProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    value: string;
    model?: IOATTwinModelNodes;
    onChange?: () => void;
    onCommit?: (value: string) => void;
    placeholder?: string;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
