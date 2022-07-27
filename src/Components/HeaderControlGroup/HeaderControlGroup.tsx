import React from 'react';
import {
    IHeaderControlGroupProps,
    IHeaderControlGroupStyleProps,
    IHeaderControlGroupStyles
} from './HeaderControlGroup.types';
import { getStyles } from './HeaderControlGroup.styles';
import { classNamesFunction, useTheme, styled, Stack } from '@fluentui/react';

const getClassNames = classNamesFunction<
    IHeaderControlGroupStyleProps,
    IHeaderControlGroupStyles
>();

/**
 * Component that wraps a collection of `HeaderControlButtons` to group them together and style them accordingly
 */
const HeaderControlGroup: React.FC<IHeaderControlGroupProps> = (props) => {
    const { children, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Stack
            horizontal
            className={classNames.root}
            styles={classNames.subComponentStyles.stack}
        >
            {children}
        </Stack>
    );
};

export default styled<
    IHeaderControlGroupProps,
    IHeaderControlGroupStyleProps,
    IHeaderControlGroupStyles
>(HeaderControlGroup, getStyles);
