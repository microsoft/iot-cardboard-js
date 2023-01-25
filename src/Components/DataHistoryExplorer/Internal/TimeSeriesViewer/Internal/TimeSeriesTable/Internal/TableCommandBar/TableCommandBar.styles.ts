import {
    ITableCommandBarStyleProps,
    ITableCommandBarStyles
} from './TableCommandBar.types';

export const classPrefix = 'cb-TableCommandBar';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITableCommandBarStyleProps
): ITableCommandBarStyles => {
    return {
        root: [classNames.root, { width: '100%' }],
        subComponentStyles: {
            commandBar: {
                root: { padding: '8px 0 12px 0px', height: 36 },
                primarySet: { paddingLeft: 8 }
            }
        }
    };
};
