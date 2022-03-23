import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    errors: Array<IComponentError>;
    primaryClickAction?: {
        buttonText: string;
        onClick: () => void;
    };
    children?: React.ReactNode;
}
