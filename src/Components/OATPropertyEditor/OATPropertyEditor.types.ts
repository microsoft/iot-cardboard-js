import { Theme } from '../../Models/Constants/Enums';
import { IDropdownOption } from '@fluentui/react';

export type OATPropertyEditorProps = {
    theme?: Theme;
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
