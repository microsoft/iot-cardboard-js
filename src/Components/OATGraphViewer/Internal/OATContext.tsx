import { Context, createContext, Dispatch } from 'react';
import { IOATNodeElement } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export interface ElementsContextProps {
    dispatch: Dispatch<any>;
    currentHovered: IOATNodeElement;
    showRelationships: boolean;
    showInheritances: boolean;
    showComponents: boolean;
    state: IOATEditorState;
}

export const ElementsContext: Context<ElementsContextProps> = createContext(
    null
);
