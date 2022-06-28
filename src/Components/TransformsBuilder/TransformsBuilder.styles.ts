import {
    ITransformsBuilderStyleProps,
    ITransformsBuilderStyles
} from './TransformsBuilder.types';

export const classPrefix = 'cb-transformsbuilder';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITransformsBuilderStyleProps
): ITransformsBuilderStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
