import { Context, createContext, Dispatch, MutableRefObject } from 'react';
import { IOATNodeElement } from '../../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export interface ElementsContextProps {
    dispatch: Dispatch<any>;
    currentNodeIdRef: MutableRefObject<any>;
    currentHovered: IOATNodeElement;
    showRelationships: boolean;
    showInheritances: boolean;
    showComponents: boolean;
    state: IOATEditorState;
}

export const ElementsContext: Context<ElementsContextProps> = createContext(
    null
);
