import React from 'react';
import {
    IPowerBIWidgetBuilderProps,
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
} from './PowerBIWidgetBuilder.types';
import { getStyles } from './PowerBIWidgetBuilder.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
>();

const PowerBIWidgetBuilder: React.FC<IPowerBIWidgetBuilderProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            {t('Hello PowerBIWidgetBuilder!')}
        </div>
    );
};

export default styled<
    IPowerBIWidgetBuilderProps,
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
>(PowerBIWidgetBuilder, getStyles);
