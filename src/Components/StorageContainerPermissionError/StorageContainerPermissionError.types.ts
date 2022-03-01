import { ComponentErrorType, IErrorComponentProps } from '../..';

export interface StorageContainerPermissionErrorProps
    extends IErrorComponentProps {
    errorType: ComponentErrorType;
    children?: React.ReactNode;
}
