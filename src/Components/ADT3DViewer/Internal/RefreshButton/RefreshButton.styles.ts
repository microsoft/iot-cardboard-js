import {
    IRefreshButtonStyleProps,
    IRefreshButtonStyles
} from './RefreshButton.types';

export const classPrefix = 'cb-refreshbutton';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IRefreshButtonStyleProps
): IRefreshButtonStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
