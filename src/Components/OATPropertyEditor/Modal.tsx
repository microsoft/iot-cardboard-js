import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';

interface IModal {
    currentNestedPropertyIndex?: number;
    currentPropertyIndex?: number;
    modalBody?: string;
    modalOpen?: boolean;
    model?: any;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<any>>;
}

export const Modal = ({
    modalOpen,
    setModalOpen,
    model,
    setModel,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    setCurrentNestedPropertyIndex,
    setModalBody,
    modalBody
}: IModal) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const getModalBody = () => {
        switch (modalBody) {
            case 'formProperty':
            default:
                return (
                    <FormUpdateProperty
                        setModalOpen={setModalOpen}
                        model={model}
                        setModel={setModel}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                    />
                );
            case 'formEnum':
                return (
                    <FormAddEnumItem
                        setModalOpen={setModalOpen}
                        model={model}
                        setModel={setModel}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                    />
                );
        }
    };

    return (
        <FluentModal
            isOpen={modalOpen}
            containerClassName={propertyInspectorStyles.modal}
        >
            {getModalBody()}
        </FluentModal>
    );
};

export default Modal;
