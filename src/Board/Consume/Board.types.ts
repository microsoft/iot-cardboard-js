import IBaseAdapter from "../../Adapters/IBaseAdapter";
import BoardInfo from "../../Models/Classes/BoardInfo";
import { SearchSpan } from "../../Models/Classes/SearchSpan";
import { Locale, Theme } from "../../Models/Constants/Enums";

export interface IBoardProps {
    adapter: IBaseAdapter;
    theme: Theme;
    locale: Locale;
    localeStrings?: Record<string, any>;
    searchSpan?: SearchSpan;
    boardInfo: BoardInfo;
    entitiesInfo?: any; //TODO: add type
}