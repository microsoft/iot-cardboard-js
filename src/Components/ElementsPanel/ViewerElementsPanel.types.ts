import { SceneVisual } from '../../Models/Classes/SceneView.types';
import { DTwin } from '../../Models/Constants/Interfaces';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IViewerElementsPanelProps {
    panelItems: Array<IViewerElementsPanelItem>;
    isLoading?: boolean;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

export interface IViewerElementsPanelListProps {
    isLoading: boolean;
    panelItems: Array<IViewerElementsPanelItem>;
    filterTerm?: string;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

export interface IViewerElementsPanelItem extends Partial<SceneVisual> {
    element: ITwinToObjectMapping;
    behaviors: Array<IBehavior>;
    twins: Record<string, DTwin>;
}
