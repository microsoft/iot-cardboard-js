import {
    IAction,
    IOATLastPropertyFocused
} from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

export interface IOATPropertySelectorPosition {
    top: number;
    left: number;
}

export type PropertySelectorProps = {
    onTagClickCallback?: () => void;
    className?: string;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    propertySelectorPosition?: IOATPropertySelectorPosition;
};
