import IBaseAdapter from '../../Adapters/IBaseAdapter';
import { BoardInfo, SearchSpan } from '../../Models/Classes';
import {
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors,
    IEntityInfo,
    Locale,
    Theme
} from '../../Models/Constants';

export interface IBoardProps {
    adapter: IBaseAdapter;
    theme: Theme;
    locale: Locale;
    localeStrings?: Record<string, any>;
    searchSpan?: SearchSpan;
    boardInfo: BoardInfo | null;
    entitiesOverride?: IEntityInfo;
    errorMessage?: string;
    onEntitySelect?: (
        twin: IADTTwin,
        model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => void;
}
