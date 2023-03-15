import { FontSizes } from '@fluentui/react';
import {
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
} from './PowerBIWidget.types';

export const classPrefix = 'cb-powerbiwidget';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    description: `${classPrefix}-description`,
    error: `${classPrefix}-error`
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
                height: '100%',
                width: '100%'
            }
        ],
        header: [
            classNames.header,
            {
                width: '100%',
                padding: 8,
                height: 36,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: FontSizes.size12
            }
        ],
        description: [
            classNames.description,
            {
                fontSize: FontSizes.medium,
                marginTop: '0 !important'
            }
        ],
        error: [
            classNames.error,
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: FontSizes.size12
            }
        ],
        subComponentStyles: {}
    };
};
