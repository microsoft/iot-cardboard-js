import { css } from '@fluentui/react';
import React from 'react';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementsList from '../ElementsPanel/Internal/ElementsList';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import { getStyles } from './VisualsModal.styles';

export interface IVisualsModalProps {
    badges: IViewerElementsPanelItem;
    onClose: () => any;
    position: { left: number; top: number };
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

const VisualsModal: React.FC<IVisualsModalProps> = ({
    onClose,
    position,
    badges,
    onItemClick,
    onItemBlur,
    onItemHover
}) => {
    const styles = getStyles();

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className={css(styles.boundaryLayer, 'cb-base-fade-in')}
            onMouseLeave={onClose}
        >
            <ElementsList
                isLoading={false}
                isModal={true}
                panelItems={badges?.element ? [badges] : []}
                onItemClick={onItemClick}
                onItemBlur={onItemBlur}
                onItemHover={onItemHover}
            />
        </div>
    );
};

export default React.memo(VisualsModal);
