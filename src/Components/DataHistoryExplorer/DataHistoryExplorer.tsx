import React, { useState } from 'react';
import {
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
} from './DataHistoryExplorer.types';
import { getStyles } from './DataHistoryExplorer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IStackTokens,
    Stack
} from '@fluentui/react';
import CardboardModal from '../CardboardModal/CardboardModal';
import { useTranslation } from 'react-i18next';
import TimeSeriesBuilder from './Internal/TimeSeriesBuilder/TimeSeriesBuilder';
import TimeSeriesViewer from './Internal/TimeSeriesViewer/TimeSeriesViewer';
import { IDataHistoryTimeSeriesTwin } from '../../Models/Constants';

const CONTENT_MAX_HEIGHT = 515;
const contentStackTokens: IStackTokens = {
    maxHeight: CONTENT_MAX_HEIGHT
};

const getClassNames = classNamesFunction<
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>();

const DataHistoryExplorer: React.FC<IDataHistoryExplorerProps> = (props) => {
    const { adapter, isOpen, onDismiss, styles } = props;

    // contexts

    // state
    const [timeSeriesTwins, setTimeSeriesTwins] = useState<
        Array<IDataHistoryTimeSeriesTwin>
    >([]);

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <CardboardModal
                contentStackProps={{ tokens: contentStackTokens }}
                isOpen={isOpen}
                onDismiss={onDismiss}
                styles={classNames.subComponentStyles.modal}
                title={t('dataHistoryExplorer.title')}
                titleIconName={'Chart'}
            >
                <Stack
                    horizontal
                    tokens={{ childrenGap: 8 }}
                    className={classNames.contentStack}
                >
                    <TimeSeriesBuilder
                        adapter={adapter}
                        onTimeSeriesTwinListChange={(twins) =>
                            setTimeSeriesTwins(twins)
                        }
                        styles={classNames.subComponentStyles.builder}
                    />
                    <TimeSeriesViewer
                        adapter={adapter}
                        timeSeriesTwinList={timeSeriesTwins}
                        styles={classNames.subComponentStyles.viewer}
                    />
                </Stack>
            </CardboardModal>
        </div>
    );
};

export default styled<
    IDataHistoryExplorerProps,
    IDataHistoryExplorerStyleProps,
    IDataHistoryExplorerStyles
>(DataHistoryExplorer, getStyles);
