import React from 'react';
import { Modal as FluentModal, ActionButton, FontIcon } from '@fluentui/react';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { IAction } from '../../../Models/Constants/Interfaces';
import { getHeaderStyles } from '../OATHeader.styles';
import FormSaveAs from './FormSaveAs';

export enum FromBody {
    delete = 'delete',
    open = 'open',
    save = 'save'
}
interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    modalBody?: string;
    modalOpen?: boolean;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

export const Modal = ({
    dispatch,
    modalBody,
    modalOpen,
    setModalOpen,
    setModalBody,
    state
}: IModal) => {
    const headerStyles = getHeaderStyles();

    const getModalBody = () => {
        switch (modalBody) {
            case FromBody.delete:
            default:
                return (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <ActionButton onClick={() => setModalOpen(false)}>
                            <FontIcon iconName={'ChromeClose'} />
                        </ActionButton>
                    </div>
                );
            case FromBody.open:
                return (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <ActionButton onClick={() => setModalOpen(false)}>
                            <FontIcon iconName={'ChromeClose'} />
                        </ActionButton>
                    </div>
                );
            case FromBody.save:
                return (
                    <FormSaveAs
                        dispatch={dispatch}
                        setModalOpen={setModalOpen}
                        setModalBody={setModalBody}
                    />
                );
        }
    };

    return (
        <FluentModal isOpen={modalOpen} containerClassName={headerStyles.modal}>
            {getModalBody()}
        </FluentModal>
    );
};

export default Modal;
