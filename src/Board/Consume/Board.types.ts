import IBaseAdapter from '../../Adapters/IBaseAdapter';
import { BoardInfo, SearchSpan } from '../../Models/Classes';
import {
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors,
    Locale,
    Theme
} from '../../Models/Constants';

export interface IBoardProps {
    adapter: IBaseAdapter;
    theme: Theme;
    locale: Locale;
    localeStrings?: Record<string, any>;
    searchSpan?: SearchSpan;
    boardInfo?: BoardInfo;
    adtTwin?: IADTTwin;
    errorMessage?: string;
    onEntitySelect?: (
        twin: IADTTwin,
        model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => void;
}
