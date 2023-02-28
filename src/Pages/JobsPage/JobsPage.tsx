import React, { useCallback } from 'react';
import {
    IJobsPageProps,
    IJobsPageStyleProps,
    IJobsPageStyles
} from './JobsPage.types';
import { getStyles } from './JobsPage.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import EnvironmentPicker from '../../Components/EnvironmentPicker/EnvironmentPicker';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { IADTInstance } from '../../Models/Constants';
import JobsContainer from '../../Components/JobsContainer/JobsContainer';

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
    // hooks

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
                //TO-DO
            }
        },
        []
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
                isLocalStorageEnabled={true}
            />
            <JobsContainer adapter={adapter} />
        </BaseComponent>
    );
};

export default styled<IJobsPageProps, IJobsPageStyleProps, IJobsPageStyles>(
    JobsPage,
    getStyles
);
