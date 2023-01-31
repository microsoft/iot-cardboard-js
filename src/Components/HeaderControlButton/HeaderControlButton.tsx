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

/**
 * Control for an action at the top of the screen on the 3D Viewer. Can accept children (most likely images) or can be styled with text/icon as appropriate.
 * Should be wrapped in a `HeaderControlGroup` if you want a border.
 */
const HeaderControlButton: React.FC<IHeaderControlButtonProps> = (props) => {
    const {
        buttonProps,
        children,
        dataTestId,
        className,
        iconProps,
        id,
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
            className={css(classNames.root, className)}
            checked={isActive}
            data-testid={dataTestId}
            iconProps={iconProps}
            id={id}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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
