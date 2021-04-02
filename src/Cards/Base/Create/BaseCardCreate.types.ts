import { ICardBaseProps } from '../../../Models/Constants';

export interface BaseCardCreateProps extends ICardBaseProps {
    children?: React.ReactNode;
    form: React.ReactNode;
    preview: React.ReactNode;
}
