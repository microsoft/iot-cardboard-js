import { Icon, PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorModalMode } from '../../../../../Models/Constants';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression
} from '../../../../../Models/Services/Utils';
import { ILinkWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getStyles } from './LinkWidget.styles';

interface IProp {
    widget: ILinkWidget;
}

export const LinkWidget: React.FC<IProp> = ({ widget }) => {
    const { t } = useTranslation();
    const { mode, twins } = useContext(BehaviorsModalContext);
    const { label, linkExpression } = widget.widgetConfiguration;

    const link =
        mode === BehaviorModalMode.preview
            ? linkExpression
            : parseLinkedTwinExpression(
                  wrapTextInTemplateString(linkExpression),
                  twins
              );

    const isSafeUrl = (url: string): boolean => {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    };

    const styles = getStyles();
    return (
        <div className={styles.linkContainer}>
            <span className={styles.linkLabel} title={label}>
                {label}
            </span>
            <PrimaryButton
                onClick={() => {
                    if (isSafeUrl(link)) {
                        window.open(link, '_blank');
                    }
                }}
                className={styles.linkButton}
                title={link}
            >
                {t('widgets.link.openLink')}
            </PrimaryButton>
            <Icon iconName="Link" styles={{ root: { fontSize: 24 } }} />
        </div>
    );
};
