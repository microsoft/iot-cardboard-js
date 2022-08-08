import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { DtdlInterface, DtdlRelationship } from '../../../../Models/Constants';

export type OATTextFieldDisplayNameProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    value: string;
    model?: DtdlInterface | DtdlRelationship;
    onChange?: () => void;
    onCommit?: (value: string) => void;
    placeholder?: string;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
