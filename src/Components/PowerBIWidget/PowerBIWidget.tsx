import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { BackgroundType } from 'powerbi-models';
import {
    IPowerBIWidgetProps,
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
} from './PowerBIWidget.types';
import { getStyles } from './PowerBIWidget.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

const getClassNames = classNamesFunction<
    IPowerBIWidgetStyleProps,
    IPowerBIWidgetStyles
>();

const PowerBIWidget: React.FC<IPowerBIWidgetProps> = (props) => {
    const { styles, widget } = props;
    const { widgetConfiguration } = widget || {};

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

    if (
        widgetConfiguration?.embedUrl &&
        (widgetConfiguration.type === 'Visual' ||
            widgetConfiguration.type === 'Tile') &&
        widgetConfiguration?.pageName &&
        widgetConfiguration?.visualName
    ) {
        return (
            <div className={classNames.root}>
                <div className={classNames.header}>
                    {widgetConfiguration.displayName}
                </div>
                <PowerBIEmbed
                    embedConfig={{
                        type: (
                            widgetConfiguration?.type || 'Visual'
                        ).toLowerCase(),
                        embedUrl: widgetConfiguration.embedUrl,
                        visualName: widgetConfiguration?.visualName,
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: false
                                }
                            },
                            background: BackgroundType.Transparent
                        },
                        filters: {}
                    }}
                />
            </div>
        );
    }
    return (
        <div className={classNames.root}>
            <div className={classNames.error}>
                {t('widgets.powerBI.errors.missingReportConfiguration')}
            </div>
        </div>
    );
};

export default withErrorBoundary(
    styled<IPowerBIWidgetProps, IPowerBIWidgetStyleProps, IPowerBIWidgetStyles>(
        PowerBIWidget,
        getStyles
    )
);
