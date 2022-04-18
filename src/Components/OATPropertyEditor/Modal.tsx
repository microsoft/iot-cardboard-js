import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';
import FormAddMapKeyValue from './FormAddMapKeyValue';

interface IModal {
    modalOpen?: boolean;
    setModalOpen?: any;
    model?: any;
    setModel?: any;
    currentPropertyIndex?: number;
    currentNestedPropertyIndex?: any;
    setCurrentNestedPropertyIndex?: any;
    setModalBody?: any;
    modalBody?: any;
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
            case 'formMap':
                return (
                    <FormAddMapKeyValue
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
