import React from 'react';
import { PrimaryButton, Modal } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { SET_OAT_ERROR } from '../../../Models/Constants/ActionTypes';
import { getEditorPageStyles } from '../OATEditorPage.Styles';
import { IOATEditorState } from '../OATEditorPage.types';
import { IAction } from '../../../Models/Constants/Interfaces';

interface IOATErrorHandlingWrapper {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
}

const OATErrorHandlingWrapper = ({
    state,
    dispatch
}: IOATErrorHandlingWrapper) => {
    const { t } = useTranslation();
    const EditorPageStyles = getEditorPageStyles();
    const { error } = state;

    const getComponentContent = () => {
        switch (error?.type ? error.type : '') {
            default:
                return (
                    <div className={EditorPageStyles.errorHandlingWrapper}>
                        <span
                            className={
                                EditorPageStyles.errorHandlingWrapperErrorTitle
                            }
                        >
                            {error && error.title
                                ? error.title
                                : t('ErrorHandlingWrapper.errorTitle')}
                        </span>
                        <span
                            className={
                                EditorPageStyles.errorHandlingWrapperErrorMessage
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
                            {error && error.callbackMessage
                                ? error.callbackMessage
                                : t('ErrorHandlingWrapper.ok')}
                        </PrimaryButton>
                    </div>
                );
        }
    };

    return <Modal isOpen={!!error}>{getComponentContent()}</Modal>;
};

export default OATErrorHandlingWrapper;
