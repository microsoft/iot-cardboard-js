import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
} from './PowerBIWidgetBuilder.types';

export const classPrefix = 'cb-powerbiwidgetbuilder';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    description: `${classPrefix}-description`
};
export const getStyles = (
    props: IPowerBIWidgetBuilderStyleProps
): IPowerBIWidgetBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }
        ],
        header: [
            classNames.header,
            {
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.size16
            }
        ],
        description: [
            classNames.description,
            {
                color: props.theme.palette.neutralSecondary,
                fontSize: FontSizes.medium
            }
        ]
    };
};
