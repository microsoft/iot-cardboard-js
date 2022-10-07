import { Context, createContext } from 'react';
import { IOATNodeElement } from '../../../Models/Constants/Interfaces';

export interface ElementsContextProps {
    currentHovered: IOATNodeElement;
    showRelationships: boolean;
    showInheritances: boolean;
    showComponents: boolean;
}

export const ElementsContext: Context<ElementsContextProps> = createContext(
    null
);
