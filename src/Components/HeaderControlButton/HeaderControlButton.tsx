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
        id,
        iconProps,
        imageProps,
        isActive,
        onClick,
        onMouseEnter,
        onMouseLeave,
        styles,
        title
    } = props;

    /** ----- hooks ----- */
    const theme = useTheme();
    const classNames = getClassNames(styles, { theme, isActive });

    return (
        <IconButton
            {...buttonProps}
            id={id}
            iconProps={iconProps}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={css(classNames.root, className)}
            styles={classNames.subComponentStyles.button()}
            title={title}
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
