import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles
} from '@fluentui/react';
import { IOATTwinModelNodes } from '../../../../Models/Constants';
import { IOATEditorState } from '../../OATEditorPage.types';

export type OATTextFieldNameProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    onCommit?: (value: string) => void;
    placeholder?: string;
    model: IOATTwinModelNodes;
    models: IOATTwinModelNodes[];
    value: string;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
};
