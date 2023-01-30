import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
} from './PowerBIWidget.types';

export const classPrefix = 'cb-powerbiwidget';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    description: `${classPrefix}-description`
};
export const getStyles = (
    props: IPowerBIWidgetStyleProps
): IPowerBIWidgetStyles => {
    return {
        root: [
            classNames.root,
            {
                borderRight: `1px solid ${props.theme.palette.neutralLight}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }
        ],
        header: [
            classNames.header,
            {
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.size16,
                marginTop: '0 !important'
            }
        ],
        description: [
            classNames.description,
            {
                color: props.theme.palette.neutralSecondary,
                fontSize: FontSizes.medium,
                marginTop: '0 !important'
            }
        ],
        subComponentStyles: {}
    };
};
