import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IDialogContentProps,
    IDialogStyles,
    IModalProps,
    PrimaryButton,
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    title?: string;
    message?: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel: () => any;
    onConfirmDeletion: () => any;
}

const ConfirmDeleteDialog: React.FC<Props> = ({
    title,
    message,
    isOpen,
    setIsOpen,
    onCancel,
    onConfirmDeletion,
}) => {
    const { t } = useTranslation();

    const confirmDeletionDialogProps: IDialogContentProps = {
        type: DialogType.normal,
        title: title ?? t('confirmDeletion'),
        closeButtonAriaLabel: t('close'),
        subText: message ?? t('confirmDeletionDesc'),
    };

    const confirmDeletionDialogStyles: Partial<IDialogStyles> = {
        main: {
            maxWidth: 450,
            minHeight: 165,
        },
    };

    const confirmDeletionModalProps: IModalProps = {
        isBlocking: false,
        styles: confirmDeletionDialogStyles,
        className: 'cb-scene-builder-element-list-dialog-wrapper',
    };

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={() => {
                setIsOpen(false);
                onCancel();
            }}
            dialogContentProps={confirmDeletionDialogProps}
            modalProps={confirmDeletionModalProps}
        >
            <DialogFooter>
                <DefaultButton
                    onClick={() => {
                        setIsOpen(false);
                        onCancel();
                    }}
                    text={t('cancel')}
                    data-testid={'deleteDialog-cancel'}
                />
                <PrimaryButton
                    onClick={() => {
                        onConfirmDeletion();
                        setIsOpen(false);
                    }}
                    text={t('delete')}
                    data-testid={'deleteDialog-confirm'}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
