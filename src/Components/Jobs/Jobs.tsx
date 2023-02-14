import React, { useCallback, useState } from 'react';
import {
    IJobsProps,
    IJobsStyleProps,
    IJobsStyles,
    INewJob
} from './Jobs.types';
import { getStyles } from './Jobs.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    ActionButton
} from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import EnvironmentPicker from '../EnvironmentPicker/EnvironmentPicker';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { IADTInstance } from '../../Models/Constants';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import JobsListWrapper from './Internal/JobsListWrapper/JobsListWrapper';
import { useAdapter } from '../../Models/Hooks';
import { useTranslation } from 'react-i18next';
import SceneRefreshButton from '../SceneRefreshButton/SceneRefreshButton';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import JobsDialog from './Internal/JobsDialog/JobsDialog';
import JobsList from './Internal/JobsList/JobsList';

const getClassNames = classNamesFunction<IJobsStyleProps, IJobsStyles>();

const Jobs: React.FC<IJobsProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    adtEnvironmentPicker,
    styles
}) => {
    // contexts
    // const { deeplinkDispatch, deeplinkState } = useDeeplinkContext();
    const [isJobsDialogOpen, setIsJobsDialogOpen] = useState(false);
    const [lastRefreshTime] = useState<number>(null);
    const [nextRefreshTime] = useState<number>(null);

    //hooks
    const { t } = useTranslation();

    const addJob = useAdapter({
        adapterMethod: () => adapter.addJob(outputUri, inputUri, jobId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const deleteJob = useAdapter({
        adapterMethod: () => adapter.deleteJob(jobId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const cancelJob = useAdapter({
        adapterMethod: () => adapter.cancelJob(jobId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const getAllJobs = useAdapter({
        adapterMethod: () => adapter.cancelJob(jobId),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // state
    const [
        isEnvironmentPickerDialogOpen,
        setIsEnvironmentPickerDialogOpen
    ] = useState(false);

    styles;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const handleAdtInstanceChange = useCallback(
        (
            adtInstance: string | IADTInstance,
            adtInstances: Array<string | IADTInstance>
        ) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_ADT_INSTANCE,
                payload: {
                    adtInstance
                }
            });
            if (adtEnvironmentPicker?.onAdtInstanceChange) {
                adtEnvironmentPicker.onAdtInstanceChange(
                    adtInstance,
                    adtInstances
                );
            }
        },
        [deeplinkDispatch, adtEnvironmentPicker]
    );
    /**TO-DO */
    const triggerRuntimeRefetch = () => {
        return null;
    };

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            containerClassName={classNames.root}
        >
            <EnvironmentPicker
                adapter={adapter}
                adtInstanceUrl={deeplinkState.adtUrl}
                onAdtInstanceChange={handleAdtInstanceChange}
                {...(adtEnvironmentPicker?.isLocalStorageEnabled && {
                    isLocalStorageEnabled: true,
                    localStorageKey: adtEnvironmentPicker?.localStorageKey,
                    selectedItemLocalStorageKey:
                        adtEnvironmentPicker?.selectedItemLocalStorageKey
                })}
                isDialogOpen={isEnvironmentPickerDialogOpen}
                onDismiss={() => {
                    setIsEnvironmentPickerDialogOpen(false);
                }}
            />

            <Stack>
                <ActionButton
                    iconProps={{ iconName: 'Add' }}
                    onClick={() => {
                        setIsJobsDialogOpen(true);
                    }}
                >
                    {t('addNew')}
                </ActionButton>
                <SceneRefreshButton
                    lastRefreshTimeInMs={lastRefreshTime}
                    refreshFrequency={nextRefreshTime - lastRefreshTime}
                    onClick={triggerRuntimeRefetch}
                />
            </Stack>
            <JobsList
                listJobs={() => {
                    getAllJobs.callAdapter();
                }} //get list of jobs
                deleteJobs={() => {
                    getAllJobs.callAdapter();
                }} // callback for when job is deleted
                cancelJobs={() => {
                    getAllJobs.callAdapter();
                }} //callback for when a job is canceled
            />
            {isJobsDialogOpen && (
                <JobsDialog
                    adapter={adapter}
                    isOpen={isJobsDialogOpen}
                    onClose={() => {
                        setIsJobsDialogOpen(false);
                        //add more stuff
                    }}
                    onAddJob={(newJob: INewJob) => {
                        addJob.callAdapter(newJob);
                    }}
                />
            )}
        </BaseComponent>
    );
};

export default styled<IJobsProps, IJobsStyleProps, IJobsStyles>(
    Jobs,
    getStyles
);
