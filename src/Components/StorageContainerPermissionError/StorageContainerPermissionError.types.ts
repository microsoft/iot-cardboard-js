import { IComponentError } from '../../Models/Constants';

export interface StorageContainerPermissionErrorProps {
    errors: Array<IComponentError>;
    children?: React.ReactNode;
}
