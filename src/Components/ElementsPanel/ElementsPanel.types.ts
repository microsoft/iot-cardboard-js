import {
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementsPanelItem } from './Internal/ElementList';

export interface ElementsPanelProps {
    panelItems: Array<ElementsPanelItem>;
    isLoading?: boolean;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        meshIds: Array<string>
    ) => void;
    onItemHover: (item: ITwinToObjectMapping | IVisual) => void;
}
