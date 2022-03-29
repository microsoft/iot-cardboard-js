import { Icon, PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DTwin } from '../../../../../Models/Constants';
import { performSubstitutions } from '../../../../../Models/Services/Utils';
import { ILinkWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getStyles } from './LinkWidget.styles';

interface IProp {
    widget: ILinkWidget;
    twins: Record<string, DTwin>;
}

export const LinkWidget: React.FC<IProp> = ({ widget, twins }) => {
    const { t } = useTranslation();
    const { isPreview } = useContext(BehaviorsModalContext);
    const { label, linkExpression } = widget.widgetConfiguration;

    const link = isPreview
        ? linkExpression
        : performSubstitutions(linkExpression, twins);
    const styles = getStyles();
    return (
        <div className={styles.linkContainer}>
            <span className={styles.linkLabel} title={label}>
                {label}
            </span>
            <PrimaryButton
                onClick={() => window.open(link, '_blank')}
                className={styles.linkButton}
                title={link}
            >
                {t('widgets.link.openLink')}
            </PrimaryButton>
            <Icon iconName="Link" styles={{ root: { fontSize: 24 } }} />
        </div>
    );
};
