import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    errors: Array<IComponentError>;
    primaryOnClickAction?: () => void;
    buttonText?: string;
    children?: React.ReactNode;
}
