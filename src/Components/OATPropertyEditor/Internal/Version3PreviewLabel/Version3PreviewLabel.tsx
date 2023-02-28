import React from 'react';
import {
    IVersion3PreviewLabelProps,
    IVersion3PreviewLabelStyleProps,
    IVersion3PreviewLabelStyles
} from './Version3PreviewLabel.types';
import { getStyles } from './Version3PreviewLabel.styles';
import {
    ActionButton,
    classNamesFunction,
    styled,
    TooltipHost
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { DOCUMENTATION_LINKS } from '../../../../Models/Constants';

const getClassNames = classNamesFunction<
    IVersion3PreviewLabelStyleProps,
    IVersion3PreviewLabelStyles
>();

const PreviewLabel: React.FC<IVersion3PreviewLabelProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <TooltipHost
                content={t(
                    'OAT.PropertyEditor.Version3PreviewLabel.badgeCalloutText'
                )}
                calloutProps={{
                    gapSpace: 6
                }}
            >
                <ActionButton
                    href={DOCUMENTATION_LINKS.ontologyConceptsVersions}
                    target={'_blank'}
                    styles={classNames.subComponentStyles.badgeButton?.()}
                >
                    {t('OAT.PropertyEditor.Version3PreviewLabel.badgeText')}
                </ActionButton>
            </TooltipHost>
        </div>
    );
};

export default styled<
    IVersion3PreviewLabelProps,
    IVersion3PreviewLabelStyleProps,
    IVersion3PreviewLabelStyles
>(PreviewLabel, getStyles);
