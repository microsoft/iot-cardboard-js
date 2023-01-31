import React from 'react';
import { Modal } from '@fluentui/react';
import { OATModalProps } from './OATModal.types';

export const OATModal = ({ children, isOpen, className }: OATModalProps) => {
    return (
        <Modal isOpen={isOpen} containerClassName={className}>
            {children}
        </Modal>
    );
};

export default OATModal;
