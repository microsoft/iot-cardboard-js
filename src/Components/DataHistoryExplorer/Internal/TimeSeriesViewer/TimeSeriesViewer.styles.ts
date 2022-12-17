import {
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
} from './TimeSeriesViewer.types';

export const classPrefix = 'cb-time-series-viewer';
const classNames = {
    root: `${classPrefix}-root`,
    commandWrapper: `${classPrefix}-command-wrapper`,
    command: `${classPrefix}-command`
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
        command: [
            classNames.command,
            {
                paddingRight: 12,
                margin: '0 !important',
                span: { textOverflow: 'ellipsis', overflow: 'hidden' }
            }
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
            chartWrapper: { root: { overflow: 'hidden', padding: '12px 0' } }
        }
    };
};
