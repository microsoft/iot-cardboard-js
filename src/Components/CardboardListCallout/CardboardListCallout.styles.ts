import {
    IButtonStyles,
    ICalloutContentStyles,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-list-callout`;
const classNames = {
    title: `${classPrefix}-title`,
    list: `${classPrefix}-list`,
    resultText: `${classPrefix}-resultText`
};
export const getCardboardListCalloutComponentStyles = memoizeFunction(() => {
    const ellipseStyles = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };
    return mergeStyleSets({
        title: [
            classNames.title,
            {
                marginTop: 0,
                fontWeight: 600,
                ...ellipseStyles
            }
        ],
        list: [
            classNames.list,
            {
                paddingTop: 12,
                '.ms-List-surface': {
                    maxHeight: 200,
                    overflowX: 'hidden',
                    overflowY: 'auto'
                },
                '.cb-basic-list-item-root': {
                    padding: '8px 12px 8px 0'
                },
                '.ms-List-cell:last-of-type': {
                    '.cb-basic-list-item-root': {
                        paddingBottom: 0
                    }
                }
            }
        ],
        resultText: [
            classNames.resultText,
            {
                fontSize: 12,
                marginTop: 8,
                opacity: 0.6
            }
        ]
    });
});

export const getCardboardListCalloutStyles = memoizeFunction(
    (theme: Theme) =>
        ({
            root: {
                padding: '16px 20px 20px',
                width: 300,
                backgroundColor: theme.semanticColors.bodyBackground
            },
            calloutMain: {
                backgroundColor: 'unset'
            }
        } as ICalloutContentStyles)
);

export const cardboardListCalloutPrimaryButtonStyles = {
    root: {
        marginTop: 16
    }
} as IButtonStyles;
