import {
    FontSizes,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-basic-list-item`;
const classNames = {
    textContainer: `${classPrefix}-text-container`,
    primaryText: `${classPrefix}-primary-text`,
    root: `${classPrefix}-root`
};
export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        root: [
            classNames.root,
            {
                background: theme.palette.white,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'horizontal',
                position: 'relative',
                padding: '8px 12px',
                width: '100%'
            } as IStyle
        ],
        primaryText: [
            classNames.primaryText,
            {
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: theme.palette.black,
                fontSize: FontSizes.size14
            } as IStyle
        ]
    });
});
