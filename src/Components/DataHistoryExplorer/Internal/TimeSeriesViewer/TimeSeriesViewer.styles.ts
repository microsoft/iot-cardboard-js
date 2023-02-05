import {
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
} from './TimeSeriesViewer.types';

export const classPrefix = 'cb-time-series-viewer';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITimeSeriesViewerStyleProps
): ITimeSeriesViewerStyles => {
    return {
        root: [
            classNames.root,
            { height: '100%', '> div': { height: '100%' } }
        ],
        subComponentStyles: {
            pivot: {
                itemContainer: {
                    height: 'calc(100% - 36px)',
                    '> div': {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }
            },
            loadingSpinner: { root: { height: '100%' } },
            noSeriesIllustration: { container: { flex: 1, padding: 0 } },
            commandBar: {
                root: { height: 60 },
                subComponentStyles: {
                    commandBar: { root: { padding: '8px 8px 16px 0' } }
                }
            },
            chart: { root: { flexGrow: 1, overflow: 'hidden', paddingTop: 8 } },
            table: { root: { flexGrow: 1, height: 'unset' } }
        }
    };
};
