import React from 'react';
import {
    ITransformsBuilderProps,
    ITransformsBuilderStyleProps,
    ITransformsBuilderStyles
} from './TransformsBuilder.types';
import { getStyles } from './TransformsBuilder.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';

const getClassNames = classNamesFunction<
    ITransformsBuilderStyleProps,
    ITransformsBuilderStyles
>();

const TransformsBuilder: React.FC<ITransformsBuilderProps> = (props) => {
    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return <div className={classNames.root}>Hello TransformsBuilder!</div>;
};

export default styled<
    ITransformsBuilderProps,
    ITransformsBuilderStyleProps,
    ITransformsBuilderStyles
>(TransformsBuilder, getStyles);
