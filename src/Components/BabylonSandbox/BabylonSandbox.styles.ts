import {
    IBabylonSandboxStyleProps,
    IBabylonSandboxStyles
} from './BabylonSandbox.types';

export const classPrefix = 'cb-babylonsandbox';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IBabylonSandboxStyleProps
): IBabylonSandboxStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
