import React from 'react';
import { PanelWidget } from '../PanelWidget/PanelWidget';

interface IProp {
    title: string;
    config: any;
    twins: any;
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
