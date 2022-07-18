import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { IOATTwinModelNodes } from '../../../../Models/Constants';

export type OATTextFieldIdProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    model: IOATTwinModelNodes;
    models: IOATTwinModelNodes[];
    onChange?: () => void;
    onCommit?: (value: string) => void;
    placeholder?: string;
    value: string;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
