import IBaseAdapter from "../../Adapters/IBaseAdapter";
import { BoardInfo, IEntityInfo } from "../../Models/Classes/BoardInfo";
import { SearchSpan } from "../../Models/Classes/SearchSpan";
import { Locale, Theme } from "../../Models/Constants/Enums";
import { IADTTwin, IADTModel, IResolvedRelationshipClickErrors } from '../../Models/Constants';

export interface IBoardProps {
    adapter: IBaseAdapter;
    theme: Theme;
    locale: Locale;
    localeStrings?: Record<string, any>;
    searchSpan?: SearchSpan;
    boardInfo: BoardInfo | null;
    entitiesOverride?: IEntityInfo;
    errorMessage?: string;
    onEntitySelect?: (twin: IADTTwin, model: IADTModel, errors?: IResolvedRelationshipClickErrors) => void;
}