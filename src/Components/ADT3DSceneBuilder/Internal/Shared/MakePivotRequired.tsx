import { IPivotItemProps } from '@fluentui/react';
import React from 'react';
import { customPivotItemStyles } from '../Behaviors/BehaviorsForm.styles';

export function setPivotToRequired(
    isValid: boolean | undefined,
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null
): JSX.Element | null {
    if (!link || !defaultRenderer) {
        return null;
    }
    return (
        <span className={customPivotItemStyles.root}>
            {defaultRenderer({ ...link, itemIcon: undefined })}
            {/* TODO: Add an aria label of some kind here for screen readers to see this error state */}
            {isValid === false && (
                <span className={customPivotItemStyles.alert} />
            )}
        </span>
    );
}
