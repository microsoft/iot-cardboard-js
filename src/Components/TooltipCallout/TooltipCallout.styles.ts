import {
    ITooltipCalloutStyleProps,
    ITooltipCalloutStyles
} from './TooltipCallout.types';

export const classPrefix = 'cb-tooltipcallout';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: ITooltipCalloutStyleProps
): ITooltipCalloutStyles => {
    const { theme } = props;
    return {
        root: {
            height: 'fit-content',
            width: 'fit-content',
            ...[classNames.root]
        },
        subComponentStyles: {
            button: {
                root: {
                    marginBottom: -3,
                    color: theme.semanticColors.bodyText
                }
            },
            callout: {
                root: {
                    maxWidth: 300,
                    padding: 8
                    // },
                    // beak: {
                    //     border: '8px solid transparent',
                    //     padding: '8px',
                    //     margin: '8px'
                }
            }
        }
    };
};
