import React from 'react';
import { Visual } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { PanelWidget } from '../PanelWidget/PanelWidget';

interface IProp {
    title: string;
    config: Visual;
    twins: Record<string, DTwin>;
    onClose?: () => void;
}

export const PopupWidget: React.FC<IProp> = ({
    title,
    config,
    onClose,
    twins
}) => {
    const doClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div>
            <div className="cb-adt-3dviewer-popup-title">{title}</div>
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
