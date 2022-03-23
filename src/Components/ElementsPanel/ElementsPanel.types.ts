import {
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';
import { ElementsPanelItem } from './Internal/ElementList';

export interface ElementsPanelProps {
    baseComponentProps?: BaseComponentProps;
    panelItems: Array<ElementsPanelItem>;
    isLoading?: boolean;
    onItemClick?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void;
}
