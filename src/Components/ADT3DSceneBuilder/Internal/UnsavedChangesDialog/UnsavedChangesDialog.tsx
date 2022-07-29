import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IDialogContentProps,
    IDialogStyles,
    IModalProps,
    PrimaryButton
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    title?: string;
    message?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirmDiscard: () => void;
}

const unsavedChangesDialogStyles: Partial<IDialogStyles> = {
    main: {
        maxWidth: 450,
        minHeight: 165
    }
};

const UnsavedChangesDialog: React.FC<Props> = ({
    title,
    message,
    isOpen,
    onClose,
    onConfirmDiscard
}) => {
    const { t } = useTranslation();

    const unsavedChangesDialogProps: IDialogContentProps = {
        type: DialogType.normal,
        title: title ?? t('discardChanges'),
        closeButtonAriaLabel: t('close'),
        subText: message ?? t('discardChangesDesc')
    };

    const unsavedChangesModalProps: IModalProps = {
        isBlocking: false,
        styles: unsavedChangesDialogStyles
    };

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onClose}
            dialogContentProps={unsavedChangesDialogProps}
            modalProps={unsavedChangesModalProps}
        >
            <DialogFooter>
                <DefaultButton onClick={onClose} text={t('cancel')} />
                <PrimaryButton
                    onClick={() => {
                        onConfirmDiscard();
                        onClose();
                    }}
                    text={t('discard')}
                    autoFocus
                />
            </DialogFooter>
        </Dialog>
    );
};

export default UnsavedChangesDialog;
