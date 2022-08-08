import React from 'react';
import { PrimaryButton, Modal } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { SET_OAT_ERROR } from '../../../Models/Constants/ActionTypes';
import { getEditorPageStyles } from '../OATEditorPage.styles';
import { IOATEditorState } from '../OATEditorPage.types';
import { IAction } from '../../../Models/Constants/Interfaces';

interface IOATErrorHandlingModalProps {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    state: IOATEditorState;
}

const OATErrorHandlingModal = ({
    state,
    dispatch
}: IOATErrorHandlingModalProps) => {
    const { t } = useTranslation();
    const editorPageStyles = getEditorPageStyles();
    const { error } = state;

    const getComponentContent = () => {
        switch (error?.type ? error.type : '') {
            default:
                return (
                    <div className={editorPageStyles.errorHandlingWrapper}>
                        <span
                            className={
                                editorPageStyles.errorHandlingWrapperErrorTitle
                            }
                        >
                            {error && error.title
                                ? error.title
                                : t('ErrorHandlingWrapper.errorTitle')}
                        </span>
                        <span
                            className={
                                editorPageStyles.errorHandlingWrapperErrorMessage
                            }
                        >
                            {error && error.message
                                ? error.message
                                : t('ErrorHandlingWrapper.errorMessage')}
                        </span>

                        <PrimaryButton
                            onClick={() => {
                                if (error && error?.callback) {
                                    error?.callback();
                                    return;
                                }
                                dispatch({
                                    type: SET_OAT_ERROR,
                                    payload: null
                                });
                            }}
                        >
                            {error && t('ErrorHandlingWrapper.ok')}
                        </PrimaryButton>
                    </div>
                );
        }
    };

    return <Modal isOpen={!!error}>{getComponentContent()}</Modal>;
};

export default OATErrorHandlingModal;
