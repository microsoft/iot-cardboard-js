import { Theme } from '../../Models/Constants/Enums';
import { DtdlInterface, DtdlInterfaceContent } from '../..';

export type OATPropertyEditorProps = {
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
