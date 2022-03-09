import {
    FontSizes,
    IButtonStyles,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { StyleConstants } from '../../Models/Constants';

export const getStyles = memoizeFunction((theme: Theme) => {
    const ellipseStyles = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };
    return mergeStyleSets({
        checkbox: { marginRight: 8 },
        endIcon: { marginLeft: '8px' },
        icon: { marginRight: '8px', fontSize: StyleConstants.icons.size16 },
        menuIcon: { opacity: 0 },
        textContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden',
            textAlign: 'start'
        },
        primaryText: {
            color: theme.palette.black,
            fontSize: FontSizes.size14,
            ...ellipseStyles
        },
        secondaryText: {
            color: theme.palette.neutralSecondary,
            fontSize: FontSizes.size12,
            ...ellipseStyles
        }
    });
});
export const getButtonStyles = memoizeFunction(
    (): IButtonStyles => {
        return {
            root: {
                border: 0,
                alignItems: 'start', // top align everything
                padding: '8px 12px',
                width: '100%',
                height: 'auto',
                ':hover .cb-more-menu, :focus .cb-more-menu, .cb-more-menu-visible': {
                    opacity: 1
                }
            },
            rootFocused: {
                backgroundColor: StyleConstants.listItems.hoverBackgroundColor
            },
            rootHovered: {
                backgroundColor: StyleConstants.listItems.hoverBackgroundColor
            },
            flexContainer: {
                justifyContent: 'start'
            }
        };
    }
);
