import React from 'react';
import {
    IHeaderControlButtonProps,
    IHeaderControlButtonStyleProps,
    IHeaderControlButtonStyles
} from './HeaderControlButton.types';
import {
    classNamesFunction,
    css,
    IconButton,
    Image,
    styled,
    useTheme
} from '@fluentui/react';
import { getStyles } from './HeaderControlButton.styles';

const getClassNames = classNamesFunction<
    IHeaderControlButtonStyleProps,
    IHeaderControlButtonStyles
>();

const HeaderControlButton: React.FC<IHeaderControlButtonProps> = (props) => {
    const {
        buttonProps,
        children,
        className,
        imageProps,
        isActive,
        styles
    } = props;

    /** ----- hooks ----- */
    const theme = useTheme();
    // TODO -- remove eslint overrides if not using
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const classNames = getClassNames(styles, { theme, isActive });

    return (
        <IconButton
            {...buttonProps}
            className={css(classNames.root, className)}
            styles={classNames.subComponentStyles.button()}
        >
            {imageProps && <Image {...imageProps} />}
            {children}
        </IconButton>
    );
};

export default styled<
    IHeaderControlButtonProps,
    IHeaderControlButtonStyleProps,
    IHeaderControlButtonStyles
>(HeaderControlButton, getStyles);
