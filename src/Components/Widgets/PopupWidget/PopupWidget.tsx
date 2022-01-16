import React from 'react';
import { IVisual } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { PanelWidget } from '../PanelWidget/PanelWidget';

interface IProp {
    config: IVisual;
    twins: Record<string, DTwin>;
    onClose?: () => void;
}

export const PopupWidget: React.FC<IProp> = ({ config, onClose, twins }) => {
    const doClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div>
            <PanelWidget config={config} twins={twins} />
            <button
                className="cb-adt-3dviewer-close-btn"
                onClick={() => doClose()}
            >
                Close
            </button>
        </div>
    );
};
