import { ComponentErrorType } from '../../Models/Constants';
import { IErrorComponentProps } from '../../Models/Constants/Interfaces';

export interface StorageContainerPermissionErrorProps
    extends IErrorComponentProps {
    errorType: ComponentErrorType;
    children?: React.ReactNode;
}
