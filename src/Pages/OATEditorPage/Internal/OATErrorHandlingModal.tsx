import React from 'react';
import { PrimaryButton, Modal } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { SET_OAT_ERROR } from '../../../Models/Constants/ActionTypes';
import { getEditorPageStyles } from '../OATEditorPage.styles';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';

const OATErrorHandlingModal = () => {
    // hooks
    const { t } = useTranslation();
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const { error } = oatPageState;

    // styles
    const editorPageStyles = getEditorPageStyles();

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
                                oatPageDispatch({
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
