import React, { memo } from 'react';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementList from './Internal/ElementsList';
import { IViewerElementsPanelItem } from './ViewerElementsPanel.types';

interface IAlertElementsListProps {
    alerts: IViewerElementsPanelItem;
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
    onItemBlur?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void;
}

const AlertElementsPanel: React.FC<IAlertElementsListProps> = ({
    alerts,
    onItemClick,
    onItemBlur,
    onItemHover
}) => {
    return (
        <ElementList
            isLoading={false}
            panelItems={[alerts]}
            onItemClick={onItemClick}
            onItemHover={onItemHover}
            onItemBlur={onItemBlur}
        />
    );
};

export default memo(AlertElementsPanel);
