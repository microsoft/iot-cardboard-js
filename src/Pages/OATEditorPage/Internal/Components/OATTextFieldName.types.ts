import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { DtdlInterface, DtdlRelationship } from '../../../../Models/Constants';
import { IOATEditorState } from '../../OATEditorPage.types';

export type OATTextFieldNameProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    onCommit?: (value: string) => void;
    placeholder?: string;
    model: DtdlInterface | DtdlRelationship;
    models: DtdlInterface[];
    value: string;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
