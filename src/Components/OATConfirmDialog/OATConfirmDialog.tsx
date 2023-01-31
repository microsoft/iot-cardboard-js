import React from 'react';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import ConfirmDeleteDialog from '../ADT3DSceneBuilder/Internal/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const OATConfirmDialog: React.FC = () => {
    // contexts
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // callbacks
    const closeDialog = () => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
            payload: { open: false }
        });
    };

    return (
        <ConfirmDeleteDialog
            isOpen={oatPageState.confirmDeleteOpen.open}
            message={oatPageState.confirmDeleteOpen.message}
            onClose={closeDialog}
            onConfirmDeletion={() => {
                oatPageState.confirmDeleteOpen.callback?.();
                closeDialog();
            }}
            title={oatPageState.confirmDeleteOpen.title}
        ></ConfirmDeleteDialog>
    );
};

export default OATConfirmDialog;
