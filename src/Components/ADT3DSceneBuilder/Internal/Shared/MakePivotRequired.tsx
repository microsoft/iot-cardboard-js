import { IPivotItemProps } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { customPivotItemStyles } from '../Behaviors/BehaviorsForm.styles';

export function setPivotToRequired(
    isValid: boolean | undefined,
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null
): JSX.Element | null {
    const { t } = useTranslation();
    if (!link || !defaultRenderer) {
        return null;
    }
    return (
        <span className={customPivotItemStyles.root}>
            {defaultRenderer({ ...link, itemIcon: undefined })}
            {isValid === false && (
                <span
                    aria-label={t('meshIsRequired')}
                    className={customPivotItemStyles.alert}
                />
            )}
        </span>
    );
}
