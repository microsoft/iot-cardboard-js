import React, { useContext } from 'react';
import {
    FontSizes,
    FontWeights,
    Icon,
    ITextStyles,
    Link,
    Text
} from '@fluentui/react';
import { TutorialModalPage } from '../TutorialModal.types';
import ConceptsRootSvg from '../../../Resources/Static/concepts.svg';
import IllustrationPage from './IllustrationPage';
import { useTranslation, Trans } from 'react-i18next';
import { DOCUMENTATION_LINKS } from '../../../Models/Constants';
import { TutorialModalContext } from '../TutorialModal';

const ConceptPage: React.FC<{ pageKey: TutorialModalPage }> = ({ pageKey }) => {
    const { t } = useTranslation();

    if (pageKey === TutorialModalPage.CONCEPTS) {
        return (
            <IllustrationPage
                svgSrc={ConceptsRootSvg}
                title={t('tutorialModal.conceptsRoot.title')}
                text={t('tutorialModal.conceptsRoot.text')}
            />
        );
    } else {
        let content: React.ReactElement | string = pageKey;
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
            case TutorialModalPage.WIDGETS:
                content = <Widgets />;
                break;
            case TutorialModalPage.SCENELAYERS:
                content = <SceneLayers />;
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
                                href={DOCUMENTATION_LINKS.howToElements}
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
    const { classNames } = useContext(TutorialModalContext);
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
                                href={DOCUMENTATION_LINKS.howToBehaviors}
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
    const { classNames } = useContext(TutorialModalContext);

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
                                href={DOCUMENTATION_LINKS.howToTwins}
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

const Widgets = () => {
    const { t } = useTranslation();
    const { classNames } = useContext(TutorialModalContext);

    const underlineComponent = {
        Underline: <Text styles={underlineTextStyles}></Text>
    };

    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.widgets.title')}
            </Text>
            <div className={classNames.growContent}>
                <Text block>{t('tutorialModal.widgets.mainContent')}</Text>
                <Text block styles={boldTextStyles}>
                    {t('tutorialModal.widgets.typesOfWidgets')}
                </Text>
                <Text>
                    <Trans
                        t={t}
                        i18nKey="tutorialModal.widgets.gaugeDescription"
                        components={underlineComponent}
                    />
                </Text>
                <Text>
                    <Trans
                        t={t}
                        i18nKey="tutorialModal.widgets.linkDescription"
                        components={underlineComponent}
                    />
                </Text>
                <Text>
                    <Trans
                        t={t}
                        i18nKey="tutorialModal.widgets.valueDescription"
                        components={underlineComponent}
                    />
                </Text>
            </div>
            <Text>
                <Trans
                    t={t}
                    i18nKey="tutorialModal.docLinkBlurb"
                    components={{
                        DocLink: (
                            <Link
                                href={DOCUMENTATION_LINKS.howToWidgets}
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

const SceneLayers = () => {
    const { t } = useTranslation();
    const { classNames } = useContext(TutorialModalContext);

    return (
        <>
            <Text as={'h3'} styles={conceptTitleStyles} block>
                {t('tutorialModal.sceneLayers.title')}
            </Text>
            <div className={classNames.growContent}>
                <Text block>{t('tutorialModal.sceneLayers.mainContent')}</Text>
            </div>
            <Text>
                <Trans
                    t={t}
                    i18nKey="tutorialModal.docLinkBlurb"
                    components={{
                        DocLink: (
                            <Link
                                href={DOCUMENTATION_LINKS.howToLayers}
                                target="_blank"
                            ></Link>
                        )
                    }}
                />
            </Text>
        </>
    );
};

const underlineTextStyles: Partial<ITextStyles> = {
    root: {
        textDecoration: 'underline'
    }
};

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
