import { SceneVisual } from '../../Models/Classes/SceneView.types';
import { DTwin } from '../../Models/Constants/Interfaces';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export type ElementsPanelCallback = (
    item: ITwinToObjectMapping | IVisual,
    panelItem: IViewerElementsPanelItem,
    behavior?: IBehavior
) => void;
export interface IViewerElementsPanelProps {
    panelItems: Array<IViewerElementsPanelItem>;
    isLoading?: boolean;
    onItemClick: ElementsPanelCallback;
    onItemHover?: ElementsPanelCallback;
    onItemBlur?: ElementsPanelCallback;
}

export interface IViewerElementsPanelListProps {
    isLoading: boolean;
    panelItems: Array<IViewerElementsPanelItem>;
    isModal: boolean; // This is required to avoid rendering color callout on visuals modal
    filterTerm?: string;
    onItemClick: ElementsPanelCallback;
    onItemHover?: ElementsPanelCallback;
    onItemBlur?: ElementsPanelCallback;
}

export interface IViewerElementsPanelItem extends Partial<SceneVisual> {
    element: ITwinToObjectMapping;
    behaviors: Array<IBehavior>;
    twins: Record<string, DTwin>;
}
