import React from 'react';
import { IDropdownOption, Modal as FluentModal } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import FormRootModelDetails from './FormRootModelDetails';
import { FormBody } from './Constants';

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
    state?: IOATEditorState;
    languages: IDropdownOption[];
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
    state,
    languages
}: IModal) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const getModalBody = () => {
        console.log('modalBody', modalBody);
        switch (modalBody) {
            case FormBody.property:
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
                        languages={languages}
                    />
                );
            case FormBody.enum:
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
                        languages={languages}
                    />
                );
            case FormBody.rootModel:
                return (
                    <FormRootModelDetails
                        setModalOpen={setModalOpen}
                        dispatch={dispatch}
                        setModalBody={setModalBody}
                        state={state}
                        languages={languages}
                    />
                );
            default:
                <></>;
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
