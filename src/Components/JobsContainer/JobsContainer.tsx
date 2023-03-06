import React, { useEffect, useState } from 'react';
import {
    IJobsContainerProps,
    IJobsContainerStyleProps,
    IJobsContainerStyles
} from './JobsContainer.types';
import { getStyles } from './JobsContainer.styles';
import { classNamesFunction, CommandBar, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import JobsList from './Internal/JobsList/JobsList';
import JobsDialog from './Internal/JobsDialog/JobsDialog';
import useAdapter from '../../Models/Hooks/useAdapter';
import { AdapterMethodParamsForJobs, IAdtApiJob } from '../../Models/Constants';

const getClassNames = classNamesFunction<
    IJobsContainerStyleProps,
    IJobsContainerStyles
>();

const JobsContainer: React.FC<IJobsContainerProps> = ({ adapter, styles }) => {
    // state
    const [isJobsDialogOpen, setIsJobsDialogOpen] = useState(false);
    const [listOfJobs, setListOfJobs] = useState<Array<IAdtApiJob>>([]);

    // hooks
    const deleteJob = () => {
        useAdapter({
            adapterMethod: (params: AdapterMethodParamsForJobs) =>
                adapter.deleteJob(params),
            refetchDependencies: [adapter],
            isAdapterCalledOnMount: false
        });
    };

    const cancelJob = () => {
        useAdapter({
            adapterMethod: (params: AdapterMethodParamsForJobs) =>
                adapter.cancelJob(params),
            refetchDependencies: [adapter],
            isAdapterCalledOnMount: false
        });
    };

    const onAddJob = (newJob: IAdtApiJob) => {
        setListOfJobs((prevJobs) => {
            return { newJob, ...prevJobs };
        });
    };
    useEffect(() => {
        const jobs: IAdtApiJob[] = []; //getAllJobs.callAdapter();
        setListOfJobs(jobs);
    }, []);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    const _items = [
        {
            key: 'newItem',
            text: 'New',
            cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
            iconProps: { iconName: 'Add' },
            onClick: () => {
                console.log('Add');
                setIsJobsDialogOpen(true);
            }
        },
        {
            key: 'refreshJob',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => console.log('Refesh')
        }
    ];

    return (
        <div className={classNames.root}>
            <CommandBar items={_items} />
            <JobsList
                jobs={listOfJobs}
                onCancelJob={cancelJob}
                onDeleteJob={deleteJob}
            >
                Display List Here
            </JobsList>
            {isJobsDialogOpen && (
                <JobsDialog
                    adapter={adapter} // do the adapter call to add new Job
                    isOpen={isJobsDialogOpen}
                    onClose={() => {
                        setIsJobsDialogOpen(false);
                    }}
                    onAddJob={onAddJob} //callback function for any additional steps required when a new Job is added
                />
            )}
        </div>
    );
};

export default styled<
    IJobsContainerProps,
    IJobsContainerStyleProps,
    IJobsContainerStyles
>(JobsContainer, getStyles);
