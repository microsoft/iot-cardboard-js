import React, { useState } from 'react';
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
    FontIcon
} from '@fluentui/react';
import TimeSeriesBuilder from './Internal/TimeSeriesBuilder/TimeSeriesBuilder';
import { IDataHistoryTimeSeriesTwin } from '../../Models/Constants';
import { useTranslation } from 'react-i18next';

export const DataHistoryExplorerContext = React.createContext<IDataHistoryExplorerContext>(
    null
);

const getClassNames = classNamesFunction<
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>();

const DataHistoryExplorer: React.FC<IDataHistoryExplorerProps> = (props) => {
    const { adapter, hasTitle = true, styles } = props;

    // hooks
    const { t } = useTranslation();

    // state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [timeSeriesTwins, setTimeSeriesTwins] = useState<
        Array<IDataHistoryTimeSeriesTwin>
    >([]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

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
                    />
                    {/* <TimeSeriesViewer
                    timeSeriesTwinList={timeSeriesTwins}
                    styles={classNames.subComponentStyles.viewer}
                /> */}
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
