import { Theme } from '../../Models/Constants/Enums';
import { IDropdownOption } from '@fluentui/react';
import { DtdlInterface, DtdlInterfaceContent } from '../..';

export type OATPropertyEditorProps = {
    languages: IDropdownOption[];
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName?: Theme;
};
export interface IOATPropertyEditorState {
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    modalOpen?: boolean;
    modalBody?: string;
}
