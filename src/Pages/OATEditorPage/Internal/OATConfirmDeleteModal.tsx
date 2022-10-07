import React from 'react';
import { PrimaryButton, Modal, DefaultButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getEditorPageStyles } from '../OATEditorPage.styles';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

const OATConfirmDeleteModal = () => {
    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const { confirmDeleteOpen } = oatPageState;

    // styles
    const editorPageStyles = getEditorPageStyles();

    const getComponentContent = () => {
        return (
            <div className={editorPageStyles.confirmDeleteWrapper}>
                <span className={editorPageStyles.confirmDeleteWrapperTitle}>
                    {t('confirmDeletionDesc')}
                </span>

                <div className={editorPageStyles.confirmDeleteButtonsWrapper}>
                    <DefaultButton
                        onClick={() => {
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                                payload: { open: false }
                            });
                        }}
                    >
                        {t('cancel')}
                    </DefaultButton>

                    <PrimaryButton
                        onClick={() => {
                            confirmDeleteOpen.callback();
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
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
