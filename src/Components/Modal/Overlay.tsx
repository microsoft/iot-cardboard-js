import React, { useCallback } from 'react';
import { IOverlayProps } from '../../Models/Constants';
import './Overlay.scss';

const Overlay: React.FC<IOverlayProps> = ({ onClose, children }) => {
    // Absence of onClose implies that the overlay cannot be closed.
    // onClose is offloaded to the consumer of overlay to handle deciding whether to render the overlay instance
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
