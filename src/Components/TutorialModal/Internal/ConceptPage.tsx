import React from 'react';
import {
    FontSizes,
    FontWeights,
    Icon,
    ITextStyles,
    Link,
    memoizeFunction,
    mergeStyleSets,
    Text
} from '@fluentui/react';
import { TutorialModalPage } from '../TutorialModal.types';
import ConceptsRootSvg from '../../../Resources/Static/concepts.svg';
import IllustrationPage from './IllustrationPage';
import { useTranslation, Trans } from 'react-i18next';

const ConceptPage: React.FC<{ pageKey: string }> = ({ pageKey }) => {
    if (pageKey === TutorialModalPage.CONCEPTS) {
        return (
            <IllustrationPage
                svgSrc={ConceptsRootSvg}
                title="Need a deeper dive on the concepts?"
                text="Browse the help content or check out our documentation for step by step tutorials!"
            />
        );
    } else {
        let content: any = pageKey;
        switch (pageKey) {
            case TutorialModalPage.ELEMENTS:
                content = <Elements />;
                break;
            case TutorialModalPage.BEHAVIORS:
                content = <Behaviors />;
                break;
            case TutorialModalPage.TWINS:
                content = <Twins />;
                break;
            default:
                break;
        }
        return (
            <div
                style={{
                    height: '100%',
                    padding: '0px 140px 20px 20px',
                    whiteSpace: 'pre-line',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {content}
            </div>
        );
    }
};

const Elements = () => {
    const { t } = useTranslation();
    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.elements.title')}
            </Text>
            <Text block styles={{ root: { marginBottom: 16, flexGrow: 1 } }}>
                {t('tutorialModal.elements.content')}
            </Text>
            <Text>
                <Trans
                    t={t}
                    i18nKey="tutorialModal.docLinkBlurb"
                    components={{
                        DocLink: (
                            <Link
                                href="https://www.google.com"
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

const Behaviors = () => {
    const { t } = useTranslation();
    const classNames = getStyles();
    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.behaviors.title')}
            </Text>
            <div className={classNames.growContent}>
                <Text block>{t('tutorialModal.behaviors.mainContent')}</Text>
                <Text block styles={boldTextStyles}>
                    {t('tutorialModal.behaviors.statusTitle')}
                </Text>
                <Text block>
                    {t('tutorialModal.behaviors.statusDescription')}
                </Text>
                <Text block styles={boldTextStyles}>
                    {t('tutorialModal.behaviors.alertsTitle')}
                </Text>
                <Text block>
                    {t('tutorialModal.behaviors.alertsDescription')}
                </Text>
            </div>
            <Text>
                <Trans
                    t={t}
                    i18nKey="tutorialModal.docLinkBlurb"
                    components={{
                        DocLink: (
                            <Link
                                href="https://www.google.com"
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

const Twins = () => {
    const { t } = useTranslation();
    const classNames = getStyles();
    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.twins.title')}
            </Text>
            <div className={classNames.growContent}>
                <Text block>{t('tutorialModal.twins.mainContent')}</Text>
                <div className={classNames.iconLabelContainer}>
                    <Icon
                        iconName="CRMCustomerInsightsApp"
                        styles={{ root: { marginRight: 8 } }}
                    />
                    <Text styles={boldTextStyles}>
                        {t('tutorialModal.tip')}
                    </Text>
                </div>
                <Text block>{t('tutorialModal.twins.tipContent')}</Text>
            </div>
            <Text>
                <Trans
                    t={t}
                    i18nKey="tutorialModal.docLinkBlurb"
                    components={{
                        DocLink: (
                            <Link
                                href="https://www.google.com"
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

export const classPrefix = 'cb-tutorialmodal-concept-page';
const classNames = {
    iconLabelContainer: `${classPrefix}-icon-label-container-styles`,
    growContent: `${classPrefix}-grow-content`
};
const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        iconLabelContainer: [
            classNames.iconLabelContainer,
            {
                display: 'flex',
                alignItems: 'center'
            }
        ],
        growContent: [
            classNames.growContent,
            {
                flexGrow: 1
            }
        ]
    });
});

const boldTextStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.size14
    }
};

const conceptTitleStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.size18,
        marginBottom: 20
    }
};

export default ConceptPage;
