import { IComponentError } from '../../Models/Constants';

export interface ScenePageErrorProps {
    errors: Array<IComponentError>;
    children?: React.ReactNode;
}
