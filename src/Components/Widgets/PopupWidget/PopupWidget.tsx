import React from 'react';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { IPopoverVisual } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { PanelWidget } from '../PanelWidget/PanelWidget';

interface IProp {
    config: IPopoverVisual;
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
                className={"cb-adt-3dviewer-close-btn"}
                onClick={() => doClose()}
            >
                Close
            </button>
        </div>
    );
};
