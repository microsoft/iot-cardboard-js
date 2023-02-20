import React, { useCallback } from 'react';
import {
    IOATImportProgressDialogProps,
    IOATImportProgressDialogStyleProps,
    IOATImportProgressDialogStyles
} from './OATImportProgressDialog.types';
import { getStyles } from './OATImportProgressDialog.styles';
import { classNamesFunction, Spinner, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IOATImportProgressDialogStyleProps,
    IOATImportProgressDialogStyles
>();

const LOC_KEYS = {
    loadingTitle: 'OAT.ImportProgress.loadingTitle',
    loadingSpinnerLabel: 'OAT.ImportProgress.loadingSpinnerLabel',
    successTitle: 'OAT.ImportProgress.successTitle',
    successMessage: 'OAT.ImportProgress.successMessage'
};

const OATImportProgressDialog: React.FC<IOATImportProgressDialogProps> = (
    props
) => {
    const { styles } = props;

    // contexts
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // state
    const { importState } = oatPageState;

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onClose = useCallback(() => {
        oatPageDispatch({
            type: OatPageContextActionType.UPDATE_IMPORT_PROGRESS,
            payload: {
                state: 'closed'
            }
        });
    }, [oatPageDispatch]);

    const onConfirm = useCallback(() => {
        if (importState.state === 'success') {
            oatPageDispatch({
                type: OatPageContextActionType.PERFORM_GRAPH_LAYOUT
            });
        }
        onClose();
    }, [importState.state, oatPageDispatch, onClose]);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // early abort
    if (importState.state === 'closed') {
        return null;
    }

    // data
    let viewData: {
        message: string;
        title: string;
        primaryButton: {
            text: string;
            disabled?: boolean;
        };
        cancelButton?: {
            text?: string;
            enabled: boolean;
        };
        loadingText?: string;
    };
    switch (importState.state) {
        case 'loading':
            viewData = {
                primaryButton: {
                    disabled: true,
                    text: ''
                },
                cancelButton: {
                    enabled: true
                },
                loadingText: t(LOC_KEYS.loadingSpinnerLabel, {
                    count: importState.fileCount
                }),
                message: '',
                title: t(LOC_KEYS.loadingTitle)
            };
            break;
        case 'success':
            viewData = {
                primaryButton: {
                    text: t('ok')
                },
                message: t(LOC_KEYS.successMessage, {
                    count: importState.modelCount
                }),
                title: t(LOC_KEYS.successTitle)
            };
            break;
        case 'failed':
            viewData = {
                primaryButton: {
                    text: t('ok')
                },
                message: importState.message,
                title: importState.title
            };
            break;
    }

    return (
        <ConfirmDialog
            isOpen={true}
            onClose={onClose}
            onConfirm={onConfirm}
            primaryButtonProps={{
                text: viewData.primaryButton.text,
                disabled: viewData.primaryButton.disabled
            }}
            cancelButtonProps={{ disabled: viewData.cancelButton?.enabled }}
            message={viewData.message}
            title={viewData.title}
            styles={classNames.subComponentStyles.dialog}
        >
            {viewData.loadingText && <Spinner label={viewData.loadingText} />}
        </ConfirmDialog>
    );
};

export default styled<
    IOATImportProgressDialogProps,
    IOATImportProgressDialogStyleProps,
    IOATImportProgressDialogStyles
>(OATImportProgressDialog, getStyles);
