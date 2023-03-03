import React, { useMemo } from 'react';
import {
    IJobsDialogProps,
    IJobsDialogStyleProps,
    IJobsDialogStyles
} from './JobsDialog.types';
import { getStyles } from './JobsDialog.styles';
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
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IJobsDialogStyleProps,
    IJobsDialogStyles
>();

const JobsDialog: React.FC<IJobsDialogProps> = ({ onClose, styles }) => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });
    const { t } = useTranslation();

    const handleOnClose = () => {
        onClose();
    };
    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: t('jobs.addNew'),
        closeButtonAriaLabel: t('close'),
        subText: t('')
    };
    const dialogModalProps: IModalProps = useMemo(
        () => ({
            layerProps: { eventBubblingEnabled: true }, // this is for making react-dropzone work in dialog
            isBlocking: true,
            className: 'cb-scene-list-dialog-wrapper'
        }),
        []
    );

    return (
        <Dialog
            minWidth={640}
            hidden={false}
            onDismiss={handleOnClose}
            dialogContentProps={dialogContentProps}
            modalProps={dialogModalProps}
        >
            <div className={classNames.root}> Dialog Content Here</div>
            <DialogFooter>
                <PrimaryButton
                    disabled={true}
                    onClick={() => {
                        console.log('job created');
                    }}
                    text={t('create')}
                />
                <DefaultButton
                    onClick={() => {
                        console.log('job cancelled');
                    }}
                    text={t('cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default styled<
    IJobsDialogProps,
    IJobsDialogStyleProps,
    IJobsDialogStyles
>(JobsDialog, getStyles);
