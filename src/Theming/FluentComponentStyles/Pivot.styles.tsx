import { IPivotStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';
import { IStyle, mergeStyleSets } from '@fluentui/react';
import { IPivotItemProps } from '@fluentui/react';
import React from 'react';
import { TFunction } from 'react-i18next';

export const getPivotStyles = (
    _themeSetting: Theme,
    _theme: ITheme
): Partial<IPivotStyles> => {
    return {
        icon: {
            marginRight: 4
        },
        link: {
            height: '36px'
        }
    };
};

const classPrefix = 'behaviors-form-pivot-header';
const classNames = {
    root: `${classPrefix}-root`,
    alert: `${classPrefix}-alert`
};
export const customPivotItemStyles = mergeStyleSets({
    root: [
        classNames.root,
        {
            alignItems: 'center',
            display: 'flex',
            flex: '0 1 100%'
        } as IStyle
    ],
    alert: [
        classNames.alert,
        {
            backgroundColor: 'var(--cb-color-text-error)',
            borderRadius: 6,
            height: 6,
            marginLeft: 4,
            marginTop: 4,
            width: 6,
            flexShrink: 0
        } as IStyle
    ]
});

export function setPivotToRequired(
    isValid: boolean | undefined,
    t: TFunction<string>,
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null
): JSX.Element | null {
    if (!link || !defaultRenderer) {
        return null;
    }
    return (
        <span className={customPivotItemStyles.root}>
            {defaultRenderer({ ...link, itemIcon: undefined })}
            {isValid === false && (
                <span
                    aria-label={t('fieldRequired')}
                    className={customPivotItemStyles.alert}
                />
            )}
        </span>
    );
}
