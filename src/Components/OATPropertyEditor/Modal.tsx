import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';
import { IAction } from '../../Models/Constants/Interfaces';

export enum FromBody {
    property = 'Property',
    enum = 'Enum'
}
interface IModal {
    currentNestedPropertyIndex?: number;
    currentPropertyIndex?: number;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    modalBody?: string;
    modalOpen?: boolean;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state: any;
}

export const Modal = ({
    dispatch,
    modalOpen,
    setModalOpen,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    setCurrentNestedPropertyIndex,
    setModalBody,
    modalBody,
    state
}: IModal) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const getModalBody = () => {
        switch (modalBody) {
            case FromBody.property:
            default:
                return (
                    <FormUpdateProperty
                        setModalOpen={setModalOpen}
                        dispatch={dispatch}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                        state={state}
                    />
                );
            case FromBody.enum:
                return (
                    <FormAddEnumItem
                        setModalOpen={setModalOpen}
                        dispatch={dispatch}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                        state={state}
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
