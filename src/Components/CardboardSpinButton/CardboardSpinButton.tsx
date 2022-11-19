import React from 'react';
import {
    ICardboardSpinButtonProps,
    ICardboardSpinButtonStyleProps,
    ICardboardSpinButtonStyles
} from './CardboardSpinButton.types';
import { getStyles } from './CardboardSpinButton.styles';
import { classNamesFunction, styled, TextField } from '@fluentui/react';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    ICardboardSpinButtonStyleProps,
    ICardboardSpinButtonStyles
>();

/**
 * Component that acts like a spin button but handles null values gracefully
 */
const CardboardSpinButton: React.FC<ICardboardSpinButtonProps> = (props) => {
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

    return <TextField styles={classNames.subComponentStyles.root} />;
};

export default styled<
    ICardboardSpinButtonProps,
    ICardboardSpinButtonStyleProps,
    ICardboardSpinButtonStyles
>(CardboardSpinButton, getStyles);
