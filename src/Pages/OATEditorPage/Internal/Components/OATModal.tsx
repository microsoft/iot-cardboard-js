import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { OATModalProps } from './OATModal.types';

export const OATModal = ({ children, isOpen, className }: OATModalProps) => {
    return (
        <FluentModal isOpen={isOpen} containerClassName={className}>
            {children}
        </FluentModal>
    );
};

export default OATModal;
