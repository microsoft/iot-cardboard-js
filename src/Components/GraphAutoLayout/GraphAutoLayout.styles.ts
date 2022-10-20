import {
    IGraphAutoLayoutStyleProps,
    IGraphAutoLayoutStyles
} from './GraphAutoLayout.types';

export const classPrefix = 'cb-graphautolayout';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IGraphAutoLayoutStyleProps
): IGraphAutoLayoutStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: 4,
                position: 'relative',
                width: 34,
                zIndex: '100'
            }
        ],
        subComponentStyles: {}
    };
};
