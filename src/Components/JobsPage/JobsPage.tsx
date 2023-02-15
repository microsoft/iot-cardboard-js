import React, { useCallback, useState } from 'react';
import {
    IJobsPageProps,
    IJobsPageStyleProps,
    IJobsPageStyles
} from './JobsPage.types';
import { getStyles } from './JobsPage.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import EnvironmentPicker from '../EnvironmentPicker/EnvironmentPicker';
import BaseComponent from '../BaseComponent/BaseComponent';
import { IADTInstance, IJob } from '../../Models/Constants';
import JobsWrapper from '../JobsWrapper/JobsWrapper';
import useAdapter from '../../Models/Hooks/useAdapter';

const getClassNames = classNamesFunction<
    IJobsPageStyleProps,
    IJobsPageStyles
>();

const JobsPage: React.FC<IJobsPageProps> = ({
    theme,
    locale,
    localeStrings,
    adapter,
    styles,
    adtInstanceUrl
}) => {
    // state
    const [listOfJobs, setListOfJobs] = useState<Array<IJob>>([]);

    // hooks

    const getAllJobs = useAdapter({
        adapterMethod: () => adapter.getAllJobs(),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });
    // callbacks

    const handleADTInstanceChange = useCallback(
        (
            adtInstance: string | IADTInstance,
            _adtInstances: Array<string | IADTInstance>
        ) => {
            /*
            this callback should call the method, getAllJobs(). To get the list of Jobs for the ADT Instance that the environment was changed to
        */
            if (adtInstance != '') {
                getAllJobs.callAdapter();
                const jobs: IJob[] = []; //getAllJobs.callAdapter();
                setListOfJobs(jobs);
            }
        },
        [adtInstanceUrl]
    );

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <BaseComponent
            isLoading={false}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            containerClassName={classNames.root}
        >
            <EnvironmentPicker
                adapter={adapter}
                adtInstanceUrl={adtInstanceUrl}
                onAdtInstanceChange={handleADTInstanceChange}
                isLocalStorageEnabled={false}
            />
            <JobsWrapper adapter={adapter} listOfJobs={listOfJobs} />
        </BaseComponent>
    );
};

export default styled<IJobsPageProps, IJobsPageStyleProps, IJobsPageStyles>(
    JobsPage,
    getStyles
);
