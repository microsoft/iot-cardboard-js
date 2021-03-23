import { ICardBaseProps } from '../../../../Models/Constants/Interfaces';

export interface BaseCompositeCardProps extends ICardBaseProps {
    children?: React.ReactNode;
}
