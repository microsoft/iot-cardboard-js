import React from 'react';
import { PrimaryButton, Modal, DefaultButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getEditorPageStyles } from '../OATEditorPage.styles';
import { IOATEditorState } from '../OATEditorPage.types';
import { IAction } from '../../../Models/Constants/Interfaces';
import { SET_OAT_CONFIRM_DELETE_OPEN } from '../../../Models/Constants/ActionTypes';

interface IOATConfirmDeleteModalProps {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    state: IOATEditorState;
}

const OATConfirmDeleteModal = ({
    state,
    dispatch
}: IOATConfirmDeleteModalProps) => {
    const { t } = useTranslation();
    const editorPageStyles = getEditorPageStyles();
    const { confirmDeleteOpen } = state;

    const getComponentContent = () => {
        return (
            <div className={editorPageStyles.confirmDeleteWrapper}>
                <span className={editorPageStyles.confirmDeleteWrapperTitle}>
                    {t('confirmDeletionDesc')}
                </span>

                <div className={editorPageStyles.confirmDeleteButtonsWrapper}>
                    <DefaultButton
                        onClick={() => {
                            dispatch({
                                type: SET_OAT_CONFIRM_DELETE_OPEN,
                                payload: { open: false }
                            });
                        }}
                    >
                        {t('cancel')}
                    </DefaultButton>

                    <PrimaryButton
                        onClick={() => {
                            confirmDeleteOpen.callback();
                            dispatch({
                                type: SET_OAT_CONFIRM_DELETE_OPEN,
                                payload: { open: false }
                            });
                        }}
                    >
                        {t('delete')}
                    </PrimaryButton>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={confirmDeleteOpen.open}>{getComponentContent()}</Modal>
    );
};

export default OATConfirmDeleteModal;
