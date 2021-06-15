import React, { useCallback } from 'react';
import { IOverlayProps } from '../../Models/Constants';
import './Overlay.scss';

const Overlay: React.FC<IOverlayProps> = ({ onClose, children }) => {
    // Absence of onClose implies that the modal cannot be closed.
    // onClose is offloaded to the consumer of Modal to handle deciding whether to render the Modal instance
    const onCloseWrapper = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className="cb-overlay-outer" onClick={onCloseWrapper}>
            <div className="cb-overlay-inner">{children}</div>
        </div>
    );
};

export default React.memo(Overlay);
