import React from 'react';
import {
    IConfirmDialogProps,
    IConfirmDialogStyleProps,
    IConfirmDialogStyles
} from './ConfirmDialog.types';
import { getStyles } from './ConfirmDialog.styles';
import {
    classNamesFunction,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IDialogContentProps,
    IModalProps,
    PrimaryButton,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IConfirmDialogStyleProps,
    IConfirmDialogStyles
>();

const ConfirmDialog: React.FC<IConfirmDialogProps> = (props) => {
    const {
        children,
        title,
        message,
        primaryButtonProps,
        cancelButtonProps,
        isOpen,
        onClose,
        onConfirm,
        styles
    } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // data
    const confirmDeletionDialogProps: IDialogContentProps = {
        type: DialogType.normal,
        title: title,
        closeButtonAriaLabel: t('close'),
        subText: message
    };
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: classNames.subComponentStyles.dialog
    };
    const showPrimary = primaryButtonProps?.text;
    const showCancel = !cancelButtonProps || cancelButtonProps?.text;

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onClose}
            dialogContentProps={confirmDeletionDialogProps}
            modalProps={modalProps}
            className={classNames.root}
        >
            {children}
            {(showPrimary || showCancel) && (
                <DialogFooter>
                    {showCancel && (
                        <DefaultButton
                            onClick={onClose}
                            text={t('cancel')}
                            {...cancelButtonProps}
                            data-testid={'confirmDialog-cancel'}
                        />
                    )}
                    {showPrimary && (
                        <PrimaryButton
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            text={t('ok')}
                            autoFocus
                            {...primaryButtonProps}
                            data-testid={'confirmDialog-confirm'}
                        />
                    )}
                </DialogFooter>
            )}
        </Dialog>
    );
};

export default styled<
    IConfirmDialogProps,
    IConfirmDialogStyleProps,
    IConfirmDialogStyles
>(ConfirmDialog, getStyles);
