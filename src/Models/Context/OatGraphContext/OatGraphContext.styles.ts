import {
    IOatGraphContextStyleProps,
    IOatGraphContextStyles
} from './OatGraphContext.types';

export const classPrefix = 'cb-oatgraphcontext';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IOatGraphContextStyleProps
): IOatGraphContextStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
