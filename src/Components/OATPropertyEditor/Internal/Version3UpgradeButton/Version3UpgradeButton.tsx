import React from 'react';
import {
    IVersion3UpgradeButtonProps,
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
} from './Version3UpgradeButton.types';
import { getStyles } from './Version3UpgradeButton.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
>();

const Version3UpgradeButton: React.FC<IVersion3UpgradeButtonProps> = (
    props
) => {
    const { styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return <div className={classNames.root}>Hello Version3UpgradeButton!</div>;
};

export default styled<
    IVersion3UpgradeButtonProps,
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
>(Version3UpgradeButton, getStyles);
