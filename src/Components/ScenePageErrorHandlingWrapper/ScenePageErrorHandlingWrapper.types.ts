import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    errors: Array<IComponentError>;
    children?: React.ReactNode;
}
