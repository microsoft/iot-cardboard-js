import React from 'react';
import {
    FontSizes,
    FontWeights,
    ITextStyles,
    Link,
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
    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.behaviors.title')}
            </Text>
            <div style={growContentStyles}>
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

const growContentStyles = {
    flexGrow: 1
};

const boldTextStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.size14,
        marginBottom: 2
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
