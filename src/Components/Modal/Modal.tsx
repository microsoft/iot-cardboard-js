import React, { useCallback } from 'react';
import { IModalProps } from '../../Models/Constants';
import './Modal.scss';

const Modal: React.FC<IModalProps> = ({ onClose, children }) => {
    // Absence of onClose implies that the modal cannot be closed.
    // onClose is offloaded to the consumer of Modal to handle deciding whether to render the Modal instance
    const onCloseWrapper = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className="cb-modal-outer" onClick={onCloseWrapper}>
            <div className="cb-modal-inner">{children}</div>
        </div>
    );
};

export default React.memo(Modal);
