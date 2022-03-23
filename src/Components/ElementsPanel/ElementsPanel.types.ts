import { SceneVisual } from '../../Models/Classes/SceneView.types';
import { DTwin } from '../../Models/Constants/Interfaces';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export interface ElementsPanelProps {
    baseComponentProps?: BaseComponentProps;
    panelItems: Array<ElementsPanelItem>;
    isLoading?: boolean;
    onItemClick?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

export interface ElementsPanelItem extends Partial<SceneVisual> {
    element: ITwinToObjectMapping;
    behaviors: Array<IBehavior>;
    twins: Record<string, DTwin>;
}
