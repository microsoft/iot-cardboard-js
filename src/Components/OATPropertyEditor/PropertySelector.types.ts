import { IOATLastPropertyFocused } from '../../Models/Constants/Interfaces';

export interface IOATPropertySelectorPosition {
    top: number;
    left: number;
}

export type PropertySelectorProps = {
    onTagClickCallback?: () => void;
    className?: string;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    propertySelectorPosition?: IOATPropertySelectorPosition;
};
