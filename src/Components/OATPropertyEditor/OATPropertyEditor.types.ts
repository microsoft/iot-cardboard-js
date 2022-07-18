import { IAction } from '../../Models/Constants/Interfaces';
import { Theme } from '../../Models/Constants/Enums';
import { IDropdownOption } from '@fluentui/react';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export type OATPropertyEditorProps = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    theme?: Theme;
    state?: IOATEditorState;
    languages: IDropdownOption[];
};
export interface IOATPropertyEditorState {
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    modalOpen?: boolean;
    modalBody?: string;
}
