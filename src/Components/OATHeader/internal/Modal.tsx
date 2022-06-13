import React from 'react';
import { Modal as FluentModal } from '@fluentui/react';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { IAction } from '../../../Models/Constants/Interfaces';
import { getHeaderStyles } from '../OATHeader.styles';
import FormSaveAs from './FormSaveAs';
import FromOpen from './FormOpen';
import ModalSaveCurrentProjectAndClear from './ModalSaveCurrentProjectAndClear';
import ModalDelete from './ModalDelete';
import FormSettings from './FormSettings';
import { FromBody } from './Enums';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    modalBody?: string;
    modalOpen?: boolean;
    resetProject?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

export const Modal = ({
    dispatch,
    modalBody,
    modalOpen,
    resetProject,
    setModalOpen,
    setModalBody,
    state
}: IModal) => {
    const headerStyles = getHeaderStyles();

    const getModalBody = () => {
        switch (modalBody) {
            case FromBody.delete:
                return (
                    <ModalDelete
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                        resetProject={resetProject}
                    />
                );
            case FromBody.open:
                return (
                    <FromOpen
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                    />
                );
            case FromBody.save:
                return (
                    <FormSaveAs
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        resetProject={resetProject}
                        state={state}
                    />
                );
            case FromBody.saveCurrentProjectAndClear:
                return (
                    <ModalSaveCurrentProjectAndClear
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                        resetProject={resetProject}
                    />
                );
            case FromBody.saveNewProjectAndClear:
                return (
                    <FormSaveAs
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        resetProjectOnSave
                        resetProject={resetProject}
                        state={state}
                    />
                );
            case FromBody.settings:
                return (
                    <FormSettings
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                        state={state}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <FluentModal isOpen={modalOpen} containerClassName={headerStyles.modal}>
            {getModalBody()}
        </FluentModal>
    );
};

export default Modal;
