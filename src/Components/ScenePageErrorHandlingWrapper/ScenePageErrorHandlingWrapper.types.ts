import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    errors: Array<IComponentError>;
    primaryOnclickAction?: () => void;
    buttonText?: string;
    children?: React.ReactNode;
}
