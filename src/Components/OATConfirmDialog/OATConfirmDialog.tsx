import React, { useCallback } from 'react';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import ConfirmDeleteDialog from '../ADT3DSceneBuilder/Internal/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const OATConfirmDialog: React.FC = () => {
    // contexts
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const dialogData = oatPageState.confirmDialog;

    // callbacks
    const closeDialog = () => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
            payload: { open: false }
        });
    };
    const confirm = useCallback(() => {
        if (dialogData.callback) {
            dialogData.callback();
        }
    }, [dialogData]);

    return (
        <ConfirmDeleteDialog
            isOpen={dialogData.open}
            message={dialogData.message}
            onClose={closeDialog}
            onConfirm={confirm}
            title={dialogData.title}
            primaryButtonText={dialogData.primaryButtonText}
        >
            {dialogData.additionalContent?.()}
        </ConfirmDeleteDialog>
    );
};

export default OATConfirmDialog;
