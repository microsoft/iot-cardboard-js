import {
    IElementColoringStyleProps,
    IElementColoringStyles
} from './ElementColoring.types';

export const getStyles = (
    props: IElementColoringStyleProps
): IElementColoringStyles => {
    return {
        subComponentStyles: {
            callout: {
                root: {
                    background: props.theme.palette.glassyBackground75
                },
                calloutMain: {
                    background: 'unset',
                    paddingRight: 24
                }
            }
        }
    };
};
