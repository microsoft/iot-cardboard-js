import { AdapterResult, ComponentError } from '../../../Models/Classes';
import { ICardBaseProps } from '../../../Models/Constants/Interfaces';

export interface BaseCardProps extends ICardBaseProps {
    isLoading: boolean;
    children?: React.ReactNode;
    // Using <any> type because BaseCard only cares about the presence of ANY data and or errors.
    adapterResult: AdapterResult<any>;
    cardError?: ComponentError;
    hideInfoBox?: boolean;
}
