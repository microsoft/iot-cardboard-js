import {
    IChartCommandBarStyleProps,
    IChartCommandBarStyles
} from './ChartCommandBar.types';

export const classPrefix = 'cb-chartcommandbar';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IChartCommandBarStyleProps
): IChartCommandBarStyles => {
    return {
        root: [classNames.root, { width: '100%' }],
        subComponentStyles: {
            commandBar: {
                root: { padding: '8px 0 16px 0px', height: 36 },
                primarySet: { paddingLeft: 8 }
            }
        }
    };
};
