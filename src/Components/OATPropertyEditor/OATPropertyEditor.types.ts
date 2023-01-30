import { DtdlInterface, DtdlInterfaceContent } from '../../Models/Constants';
import { Theme } from '../../Models/Constants/Enums';

export type OATPropertyEditorProps = {
    selectedItem: DtdlInterface | DtdlInterfaceContent;
    selectedThemeName?: Theme;
    /** the id of the parent model (if relationship is selected, else undefined) */
    parentModelId: string | undefined;
};
export interface IOATPropertyEditorState {
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: number;
    draggingTemplate?: boolean;
    draggingProperty?: boolean;
    modalOpen?: boolean;
    modalBody?: string;
}
