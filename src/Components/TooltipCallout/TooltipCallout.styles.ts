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
        root: [classNames.root],
        subComponentStyles: {
            button: {
                root: {
                    marginBottom: -3,
                    color: theme.semanticColors.bodyText
                }
            },
            callout: {
                root: {
                    display: 'inline-block'
                }
            }
        }
    };
};
