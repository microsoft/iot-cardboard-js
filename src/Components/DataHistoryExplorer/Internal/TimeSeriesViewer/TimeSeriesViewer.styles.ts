import {
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
} from './TimeSeriesViewer.types';

export const classPrefix = 'cb-time-series-viewer';
const classNames = {
    root: `${classPrefix}-root`,
    commandWrapper: `${classPrefix}-command-wrapper`
};
export const getStyles = (
    _props: ITimeSeriesViewerStyleProps
): ITimeSeriesViewerStyles => {
    return {
        root: [
            classNames.root,
            { height: '100%', '> div': { height: '100%' } }
        ],
        commandWrapper: [
            classNames.commandWrapper,
            { flexFlow: 'row-reverse' }
        ],
        subComponentStyles: {
            pivot: {
                root: {},
                itemContainer: {
                    height: 'calc(100% - 36px)',
                    '> div': {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }
            },
            chartWrapper: { root: { overflow: 'hidden' } }
        }
    };
};
