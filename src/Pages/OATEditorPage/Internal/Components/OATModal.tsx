import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';

interface IModalProps {
    children?: React.ReactNode;
    isOpen?: boolean;
    className?: string;
}

export const OATModal = ({ children, isOpen, className }: IModalProps) => {
    return (
        <FluentModal isOpen={isOpen} containerClassName={className}>
            {children}
        </FluentModal>
    );
};

export default OATModal;
