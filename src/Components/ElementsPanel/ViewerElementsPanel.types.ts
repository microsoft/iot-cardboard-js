import { SceneVisual } from '../../Models/Classes/SceneView.types';
import { DTwin } from '../../Models/Constants/Interfaces';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export interface ViewerElementsPanelProps {
    baseComponentProps?: BaseComponentProps;
    panelItems: Array<ViewerElementsPanelItem>;
    isLoading?: boolean;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

export interface ViewerElementsPanelListProps {
    isLoading: boolean;
    panelItems: Array<ViewerElementsPanelItem>;
    filterTerm?: string;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

export interface ViewerElementsPanelItem extends Partial<SceneVisual> {
    element: ITwinToObjectMapping;
    behaviors: Array<IBehavior>;
    twins: Record<string, DTwin>;
}
