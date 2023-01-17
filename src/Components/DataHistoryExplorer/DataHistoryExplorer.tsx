import React, { useEffect, useState } from 'react';
import {
    IDataHistoryExplorerContext,
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
} from './DataHistoryExplorer.types';
import { getStyles } from './DataHistoryExplorer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    FontIcon,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import TimeSeriesBuilder from './Internal/TimeSeriesBuilder/TimeSeriesBuilder';
import { IDataHistoryTimeSeriesTwin } from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import TimeSeriesViewer from './Internal/TimeSeriesViewer/TimeSeriesViewer';
import useAdapter from '../../Models/Hooks/useAdapter';
import { createGUID } from '../../Models/Services/Utils';

export const DataHistoryExplorerContext = React.createContext<IDataHistoryExplorerContext>(
    null
);

const getClassNames = classNamesFunction<
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>();

const DataHistoryExplorer: React.FC<IDataHistoryExplorerProps> = (props) => {
    const {
        adapter,
        hasTitle = true,
        timeSeriesTwins: timeSeriesTwinsProp = [],
        styles
    } = props;

    // state
    const [timeSeriesTwins, setTimeSeriesTwins] = useState<
        Array<IDataHistoryTimeSeriesTwin>
    >(timeSeriesTwinsProp.map((t) => ({ seriesId: createGUID(), ...t })));
    const [, setConnection] = useState(adapter.getADXConnectionInformation());

    // hooks
    const { t } = useTranslation();
    const updateConnectionAdapterData = useAdapter({
        adapterMethod: () => adapter.updateADXConnectionInformation(),
        isAdapterCalledOnMount: false,
        refetchDependencies: [adapter]
    });

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    //side-effects
    useEffect(() => {
        if (
            !adapter.getADXConnectionInformation() &&
            !updateConnectionAdapterData.isLoading
        ) {
            updateConnectionAdapterData.callAdapter();
        }
    }, []);
    useEffect(() => {
        if (updateConnectionAdapterData?.adapterResult?.result) {
            if (!updateConnectionAdapterData?.adapterResult.hasNoData()) {
                const connectionData = updateConnectionAdapterData.adapterResult.getData();
                setConnection(connectionData);
            } else {
                setConnection(null);
            }
        }
    }, [updateConnectionAdapterData?.adapterResult.result]);

    return (
        <DataHistoryExplorerContext.Provider
            value={{
                adapter
            }}
        >
            <div className={classNames.root}>
                {hasTitle && (
                    <div className={classNames.titleWrapper}>
                        <FontIcon
                            className={classNames.titleIcon}
                            iconName={'Chart'}
                        />
                        <span className={classNames.title}>
                            {t('dataHistoryExplorer.title')}
                        </span>
                    </div>
                )}
                <Stack
                    horizontal
                    tokens={{ childrenGap: 8 }}
                    className={classNames.contentStack}
                >
                    <TimeSeriesBuilder
                        onTimeSeriesTwinListChange={(twins) =>
                            setTimeSeriesTwins(twins)
                        }
                        styles={classNames.subComponentStyles.builder}
                        timeSeriesTwins={timeSeriesTwinsProp}
                    />
                    {updateConnectionAdapterData.isLoading ? (
                        <Spinner
                            styles={
                                classNames.subComponentStyles.loadingSpinner
                            }
                            size={SpinnerSize.large}
                            label={t(
                                'dataHistoryExplorer.loadingConnectionLabel'
                            )}
                            ariaLive="assertive"
                            labelPosition="top"
                        />
                    ) : (
                        <TimeSeriesViewer
                            timeSeriesTwinList={timeSeriesTwins}
                            styles={classNames.subComponentStyles.viewer}
                        />
                    )}
                </Stack>
            </div>
        </DataHistoryExplorerContext.Provider>
    );
};

export default styled<
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>(DataHistoryExplorer, getStyles);
