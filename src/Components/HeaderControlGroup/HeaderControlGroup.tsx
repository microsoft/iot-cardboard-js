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

const HeaderControlGroup: React.FC<IHeaderControlGroupProps> = (props) => {
    const { children, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Stack horizontal className={classNames.root}>
            {children}
        </Stack>
    );
};

export default styled<
    IHeaderControlGroupProps,
    IHeaderControlGroupStyleProps,
    IHeaderControlGroupStyles
>(HeaderControlGroup, getStyles);
