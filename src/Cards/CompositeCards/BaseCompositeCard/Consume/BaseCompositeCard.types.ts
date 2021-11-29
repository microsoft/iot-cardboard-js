import { ICardBaseProps } from '../../../../Models/Constants/Interfaces';

export interface BaseCompositeCardProps extends ICardBaseProps {
    isLoading?: boolean;
    children?: React.ReactNode;
}
