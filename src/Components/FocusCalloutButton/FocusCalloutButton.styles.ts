import { FontSizes, FontWeights, IStyle } from '@fluentui/react';
import {
    IFocusCalloutButtonStyleProps,
    IFocusCalloutButtonStyles
} from './FocusCalloutButton.types';

export const focusCalloutClassPrefix = 'cb-focus-callout';
const classNames = {
    root: `${focusCalloutClassPrefix}-root`,
    button: `${focusCalloutClassPrefix}-button`,
    calloutContent: `${focusCalloutClassPrefix}-callout-content`,
    header: `${focusCalloutClassPrefix}-callout-header`,
    title: `${focusCalloutClassPrefix}-callout-title`,
    titleIcon: `${focusCalloutClassPrefix}-title-icon`
};

export const getStyles = (
    _props: IFocusCalloutButtonStyleProps
): IFocusCalloutButtonStyles => {
    return {
        root: [classNames.root],
        button: [classNames.button],
        calloutContent: [
            classNames.calloutContent,
            {
                position: 'relative',
                overflow: 'hidden'
            }
        ],
        header: [
            classNames.header,
            {
                display: 'flex',
                lineHeight: '32px',
                verticalAlign: 'middle',
                padding: '12px 12px 0px 12px',
                height: 48
            } as IStyle
        ],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size16,
                marginLeft: 4,
                fontWeight: FontWeights.semibold,
                flex: '1'
            } as IStyle
        ],
        titleIcon: [
            classNames.titleIcon,
            {
                width: 32,
                height: 32,
                fontSize: FontSizes.size16,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } as IStyle
        ],
        subComponentStyles: {
            button: {},
            stack: {
                root: {
                    width: 'fit-content'
                }
            }
        }
    };
};
