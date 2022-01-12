import AdapterResult from '../../../../Models/Classes/AdapterResult';
import { ICardBaseProps } from '../../../../Models/Constants/Interfaces';

export interface BaseCompositeCardProps extends ICardBaseProps {
    /** Set of adapter results to reduce catastraphic errors from */
    adapterResults?: Array<AdapterResult<any>>;

    isLoading?: boolean;
    children?: React.ReactNode;
}
