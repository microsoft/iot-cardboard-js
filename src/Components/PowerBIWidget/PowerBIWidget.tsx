import React from 'react';
import {
    IPowerBIWidgetProps,
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
} from './PowerBIWidget.types';
import { getStyles } from './PowerBIWidget.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
>();

const PowerBIWidget: React.FC<IPowerBIWidgetProps> = (props) => {
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

    return <div className={classNames.root}>{t('greeting')}</div>;
};

export default styled<
    IPowerBIWidgetProps,
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
>(PowerBIWidget, getStyles);
