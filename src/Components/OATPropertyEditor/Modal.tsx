import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';

export enum FromBody {
    property = 'Property',
    enum = 'Enum'
}
interface IModal {
    currentNestedPropertyIndex?: number;
    currentPropertyIndex?: number;
    modalBody?: string;
    modalOpen?: boolean;
    model?: DTDLModel;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
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
            case FromBody.property:
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
            case FromBody.enum:
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
