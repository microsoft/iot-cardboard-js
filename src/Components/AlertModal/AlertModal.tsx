import React from 'react';
import { LOCAL_STORAGE_KEYS } from '../../Models/Constants/Constants';
import {
    IBehavior,
    ITwinToObjectMapping,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementsList from '../ElementsPanel/Internal/ElementsList';
import VisualRuleElementsList from '../ElementsPanel/Internal/VisualRuleElementsList';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import { getStyles } from './AlertModal.styles';

export interface IAlertModalProps {
    alerts: IViewerElementsPanelItem;
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

const showVisualRulesFeature =
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.VisualRules.showVisualRulesFeature
    ) === 'true';

const AlertModal: React.FC<IAlertModalProps> = ({
    onClose,
    position,
    alerts,
    onItemClick,
    onItemBlur,
    onItemHover
}) => {
    const styles = getStyles();

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className={styles.boundaryLayer + ' cb-base-fade-in'}
            onMouseLeave={onClose}
        >
            {showVisualRulesFeature ? (
                <VisualRuleElementsList
                    isLoading={false}
                    isModal={true}
                    panelItems={alerts?.element ? [alerts] : []}
                    onItemClick={onItemClick}
                    onItemBlur={onItemBlur}
                    onItemHover={onItemHover}
                />
            ) : (
                <ElementsList
                    isLoading={false}
                    panelItems={alerts?.element ? [alerts] : []}
                    onItemClick={onItemClick}
                    onItemBlur={onItemBlur}
                    onItemHover={onItemHover}
                />
            )}
        </div>
    );
};

export default React.memo(AlertModal);
