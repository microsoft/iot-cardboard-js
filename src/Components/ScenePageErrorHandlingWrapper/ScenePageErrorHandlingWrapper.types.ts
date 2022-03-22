import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    errors: Array<IComponentError>;
    primaryClickAction?: {
        buttonText?: string;
        OnClickAction?: () => void;
    };
    children?: React.ReactNode;
}
