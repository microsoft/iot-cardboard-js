import React, { createContext, useReducer } from 'react';
import {
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles,
    TutorialModalAction,
    TutorialModalActionType,
    TutorialModalPage
} from './TutorialModal.types';
import { getStyles } from './TutorialModal.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Modal,
    Nav,
    INavLinkGroup,
    IconButton,
    Link,
    Stack,
    PrimaryButton,
    DefaultButton,
    Icon,
    Text,
    IProcessedStyleSet,
    IIconStyles
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { DOCUMENTATION_LINKS, SCENES_DEMO_URL } from '../../Models/Constants';
import IntroductionSlideShow from './Internal/IntroductionSlideShow';
import {
    defaultTutorialModalState,
    tutorialModalReducer
} from './TutorialModal.state';
import ConceptPage from './Internal/ConceptPage';
import { TFunction, useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';

const getClassNames = classNamesFunction<
    ITutorialModalStyleProps,
    ITutorialModalStyles
>();

export const TutorialModalContext = createContext<{
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}>(null);

const TutorialModalBase: React.FC<ITutorialModalProps> = (props) => {
    const { t } = useTranslation();
    const {
        defaultPageKey = TutorialModalPage.INTRODUCTION,
        isOpen,
        onDismiss,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const titleId = useId('tutorial-modal-title');
    const [state, dispatch] = useReducer(tutorialModalReducer, {
        ...defaultTutorialModalState,
        pageKey: defaultPageKey
    });

    const navLinkGroups = getNavLinkGroups(dispatch, t);

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={() => onDismiss()}
            titleAriaId={titleId}
            styles={{
                main: { overflow: 'hidden', display: 'flex' },
                scrollableContent: { overflow: 'hidden' }
            }}
            layerProps={{ eventBubblingEnabled: true }}
        >
            <TutorialModalContext.Provider value={{ classNames }}>
                <div className={classNames.root}>
                    <div className={classNames.header}>
                        <div className={classNames.headerTextContainer}>
                            <span
                                id={titleId}
                                className={classNames.headerText}
                            >
                                {t('tutorialModal.modalTitle')}
                            </span>
                            <div className={classNames.previewBadge}>
                                <Icon
                                    iconName="Globe"
                                    styles={{ root: { marginRight: 4 } }}
                                />
                                {t('tutorialModal.publicPreview')}
                            </div>
                        </div>
                        <IconButton
                            styles={classNames.subComponentStyles.closeButton()}
                            iconProps={{ iconName: 'Cancel' }}
                            ariaLabel={t('tutorialModal.closeAriaLabel')}
                            onClick={onDismiss}
                        />
                    </div>
                    <div className={classNames.body}>
                        <div className={classNames.navContainer}>
                            <Nav
                                groups={navLinkGroups}
                                initialSelectedKey={state.pageKey}
                                styles={classNames.subComponentStyles.nav}
                            />
                        </div>
                        <div className={classNames.contentPane}>
                            {state.pageKey ===
                            TutorialModalPage.INTRODUCTION ? (
                                <IntroductionSlideShow
                                    slideNumber={state.slideNumber}
                                    setSlideNumber={(slideNumber) =>
                                        dispatch({
                                            type:
                                                TutorialModalActionType.SET_SLIDE,
                                            slide: slideNumber
                                        })
                                    }
                                />
                            ) : (
                                <ConceptPage pageKey={state.pageKey} />
                            )}
                        </div>
                    </div>
                    <div className={classNames.footer}>
                        <Stack horizontal tokens={{ childrenGap: 8 }}>
                            <Link
                                href={DOCUMENTATION_LINKS.overviewDoc}
                                target="_blank"
                            >
                                {t('tutorialModal.rootDocsLinkText')}
                            </Link>
                            <Text
                                block
                                styles={
                                    classNames.subComponentStyles.linkSeparator
                                }
                            >
                                |
                            </Text>
                            <Link
                                href={DOCUMENTATION_LINKS.viewOnGithub}
                                target="_blank"
                            >
                                {t('tutorialModal.githubLinkText')}
                            </Link>
                            <Text
                                block
                                styles={
                                    classNames.subComponentStyles.linkSeparator
                                }
                            >
                                |
                            </Text>
                            <Link
                                href={DOCUMENTATION_LINKS.viewTheQuickstart}
                                target="_blank"
                            >
                                {t('tutorialModal.quickstartLinkText')}
                            </Link>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 8 }}>
                            <PrimaryButton
                                onClick={() =>
                                    window.open(SCENES_DEMO_URL, '_blank')
                                }
                            >
                                {t('tutorialModal.primaryButtonText')}
                            </PrimaryButton>
                            <DefaultButton onClick={onDismiss}>
                                {t('tutorialModal.dismissText')}
                            </DefaultButton>
                        </Stack>
                    </div>
                </div>
            </TutorialModalContext.Provider>
        </Modal>
    );
};

const getNavLinkGroups = (
    dispatch: React.Dispatch<TutorialModalAction>,
    t: TFunction<string>
): INavLinkGroup[] => {
    return [
        {
            links: [
                {
                    key: TutorialModalPage.INTRODUCTION,
                    name: t('tutorialModal.tabs.introduction'),
                    url: '',
                    iconProps: {
                        styles: { root: { marginLeft: 8 } },
                        iconName: 'CRMCustomerInsightsApp'
                    },
                    onClick: () =>
                        dispatch({
                            type: TutorialModalActionType.SET_PAGE,
                            pageKey: TutorialModalPage.INTRODUCTION
                        })
                },
                {
                    key: TutorialModalPage.CONCEPTS,
                    name: t('tutorialModal.tabs.concepts'),
                    url: '',
                    onClick: () =>
                        dispatch({
                            type: TutorialModalActionType.SET_PAGE,
                            pageKey: TutorialModalPage.CONCEPTS
                        }),
                    isExpanded: true,
                    forceAnchor: true,
                    iconProps: {
                        styles: { root: { marginLeft: 8 } },
                        iconName: 'Zoom'
                    },
                    links: [
                        {
                            key: TutorialModalPage.ELEMENTS,
                            name: t('tutorialModal.tabs.elements'),
                            icon: 'Shapes',
                            iconProps: {
                                styles: nestedLinkIconProps,
                                iconName: 'Shapes'
                            },
                            url: '',
                            onClick: () =>
                                dispatch({
                                    type: TutorialModalActionType.SET_PAGE,
                                    pageKey: TutorialModalPage.ELEMENTS
                                })
                        },
                        {
                            key: TutorialModalPage.BEHAVIORS,
                            name: t('tutorialModal.tabs.behaviors'),
                            iconProps: {
                                styles: nestedLinkIconProps,
                                iconName: 'Ringer'
                            },
                            url: '',
                            onClick: () =>
                                dispatch({
                                    type: TutorialModalActionType.SET_PAGE,
                                    pageKey: TutorialModalPage.BEHAVIORS
                                })
                        },
                        {
                            key: TutorialModalPage.TWINS,
                            name: t('tutorialModal.tabs.twins'),
                            iconProps: {
                                styles: nestedLinkIconProps,
                                iconName: 'Link'
                            },
                            url: '',
                            onClick: () =>
                                dispatch({
                                    type: TutorialModalActionType.SET_PAGE,
                                    pageKey: TutorialModalPage.TWINS
                                })
                        },
                        {
                            key: TutorialModalPage.WIDGETS,
                            name: t('tutorialModal.tabs.widgets'),
                            iconProps: {
                                styles: nestedLinkIconProps,
                                iconName: 'SpeedHigh'
                            },
                            url: '',
                            onClick: () =>
                                dispatch({
                                    type: TutorialModalActionType.SET_PAGE,
                                    pageKey: TutorialModalPage.WIDGETS
                                })
                        },
                        {
                            key: TutorialModalPage.SCENELAYERS,
                            name: t('tutorialModal.tabs.sceneLayers'),
                            iconProps: {
                                styles: nestedLinkIconProps,
                                iconName: 'MapLayers'
                            },
                            url: '',
                            onClick: () =>
                                dispatch({
                                    type: TutorialModalActionType.SET_PAGE,
                                    pageKey: TutorialModalPage.SCENELAYERS
                                })
                        }
                    ]
                }
            ]
        }
    ];
};

const nestedLinkIconProps: IIconStyles = {
    root: {
        marginLeft: 18
    }
};

const TutorialModal: React.FC<ITutorialModalProps> = (props) => {
    const { locale, localeStrings, theme } = props;
    return (
        <BaseComponent
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
        >
            <TutorialModalBase {...props} />
        </BaseComponent>
    );
};

export default styled<
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles
>(TutorialModal, getStyles);
