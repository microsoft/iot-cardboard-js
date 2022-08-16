import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { DtdlInterface, DtdlRelationship } from '../../../../Models/Constants';

export type OATTextFieldIdProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    model: DtdlInterface | DtdlRelationship;
    models: DtdlInterface[];
    onChange?: () => void;
    onCommit?: (value: string) => void;
    placeholder?: string;
    value: string;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
