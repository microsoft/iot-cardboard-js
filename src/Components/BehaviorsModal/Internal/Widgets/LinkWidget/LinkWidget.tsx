import { Icon, PrimaryButton } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DTwin } from '../../../../../Models/Constants';
import { performSubstitutions } from '../../../../../Models/Services/Utils';
import { ILinkWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getStyles } from './LinkWidget.styles';

interface IProp {
    widget: ILinkWidget;
    twins: Record<string, DTwin>;
}

export const LinkWidget: React.FC<IProp> = ({ widget, twins }) => {
    const { t } = useTranslation();
    const linkExpression = performSubstitutions(
        widget.widgetConfiguration.linkExpression,
        twins
    );
    const styles = getStyles();
    return (
        <div className={styles.linkContainer}>
            <span
                className={styles.linkLabel}
                title={widget.widgetConfiguration.label}
            >
                {widget.widgetConfiguration.label}
            </span>
            <PrimaryButton
                onClick={() => window.open(linkExpression, '_blank')}
                className={styles.linkButton}
            >
                {t('widgets.link.openLink')}
            </PrimaryButton>
            <Icon iconName="Link" styles={{ root: { fontSize: 24 } }} />
        </div>
    );
};
