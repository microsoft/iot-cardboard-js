import React, { useCallback, useMemo, useState } from 'react';
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
    MessageBar,
    MessageBarType,
    PrimaryButton,
    Stack,
    styled,
    Text,
    TextField
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import ResourcePicker from '../../../ResourcePicker/ResourcePicker';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes
} from '../../../../Models/Constants/Enums';
import { RequiredAccessRoleGroupForStorageContainer } from '../../../../Models/Constants/Constants';
import {
    AdapterCreateJobArgs,
    IAdtApiJob,
    IAzureResource
} from '../../../../Models/Constants';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { useBoolean } from '@fluentui/react-hooks';

const getClassNames = classNamesFunction<
    IJobsDialogStyleProps,
    IJobsDialogStyles
>();

const JobsDialog: React.FC<IJobsDialogProps> = ({
    adapter, //needed for resource picker
    onClose,
    onAddJob,
    styles
}) => {
    // state
    const [jobName, setJobName] = useState<string>('');
    const [inputBlobUri, setInputBlobUri] = useState<IAzureResource | string>(
        ''
    );
    const [outputBlobUri, setOutputBlobUri] = useState<IAzureResource | string>(
        ''
    );
    const [
        invalidContainerSelection,
        { toggle: setInvalidContainerSelection }
    ] = useBoolean(false);

    const [jobUploadFailure, { toggle: setJobUploadFailure }] = useBoolean(
        false
    );

    const [isSubmitButtonDisabled, { toggle: setSubmitButton }] = useBoolean(
        true
    );
    const addJobsData = useAdapter({
        adapterMethod: (params: AdapterCreateJobArgs) =>
            adapter.createJob(params),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // callbacks
    const handleNameChange = useCallback((e, newName?: string) => {
        setJobName(newName);
    }, []);

    useMemo(() => {
        if (inputBlobUri === outputBlobUri && !inputBlobUri && !outputBlobUri) {
            setInvalidContainerSelection;
        }
        if (inputBlobUri && outputBlobUri && jobName) {
            setSubmitButton;
        }
    }, [inputBlobUri, outputBlobUri, jobName]);

    const handleSubmit = async () => {
        const newJob: AdapterCreateJobArgs = {
            jobId: jobName,
            outputBlobUri: outputBlobUri as string,
            inputBlobUri: outputBlobUri as string
        };
        await addJobsData.callAdapter(newJob);
        if (addJobsData.adapterResult?.result?.data) {
            const jobData: IAdtApiJob =
                addJobsData.adapterResult.result.data.value;
            onAddJob(jobData); //update the list of jobs
            onClose();
        } else {
            setJobUploadFailure;
        }
    };

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });
    const { t } = useTranslation();

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: t('jobs.addJob'),
        closeButtonAriaLabel: t('close')
    };
    const dialogModalProps: IModalProps = useMemo(
        () => ({
            layerProps: { eventBubblingEnabled: true }, // this is for making react-dropzone work in dialog
            isBlocking: true,
            className: 'cb-jobs-list-dialog-wrapper'
        }),
        []
    );

    return (
        <div className={classNames.root}>
            <Dialog
                minWidth={640}
                hidden={false}
                onDismiss={onClose}
                dialogContentProps={dialogContentProps}
                modalProps={dialogModalProps}
            >
                <Stack tokens={{ childrenGap: 4 }}>
                    <TextField
                        label={t('jobs.jobName')}
                        placeholder={t('jobs.jobsNamePlaceholder')}
                        required
                        value={jobName}
                        onChange={handleNameChange}
                    />

                    <ResourcePicker
                        adapter={adapter}
                        displayField={AzureResourceDisplayFields.name}
                        resourceType={AzureResourceTypes.StorageBlobContainer}
                        label={t('jobs.inputBlobContainerName')}
                        requiredAccessRoles={
                            RequiredAccessRoleGroupForStorageContainer
                        }
                        searchParams={{ take: 1000 }}
                        onChange={(resource) => {
                            setInputBlobUri(resource);
                        }}
                    />
                    <ResourcePicker
                        adapter={adapter}
                        displayField={AzureResourceDisplayFields.name}
                        resourceType={AzureResourceTypes.StorageBlobContainer}
                        label={t('jobs.outputBlobContainerName')}
                        requiredAccessRoles={
                            RequiredAccessRoleGroupForStorageContainer
                        }
                        searchParams={{ take: 1000 }}
                        onChange={(resource) => {
                            setOutputBlobUri(resource);
                        }}
                    />
                </Stack>
                {invalidContainerSelection && (
                    <Text className={classNames.errorText} variant={'small'}>
                        {t('jobs.duplicateContainerNames')}
                    </Text>
                )}
                {jobUploadFailure && (
                    <MessageBar
                        messageBarType={MessageBarType.blocked}
                        isMultiline={false}
                        dismissButtonAriaLabel={t('close')}
                    ></MessageBar>
                )}
                <DialogFooter>
                    <PrimaryButton
                        disabled={isSubmitButtonDisabled}
                        onClick={handleSubmit}
                        text={t('create')}
                    />
                    <DefaultButton onClick={onClose} text={t('cancel')} />
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default styled<
    IJobsDialogProps,
    IJobsDialogStyleProps,
    IJobsDialogStyles
>(JobsDialog, getStyles);
