import React, { useReducer } from 'react';
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
    Text
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { FRE_MODAL_LINKS, scenesDemoUrl } from '../../Models/Constants';
import IntroductionSlideShow from './Internal/IntroductionSlideShow';
import {
    defaultTutorialModalState,
    tutorialModalReducer
} from './TutorialModal.state';
import ConceptPage from './Internal/ConceptPage';
import { TFunction, useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    ITutorialModalStyleProps,
    ITutorialModalStyles
>();

const TutorialModal: React.FC<ITutorialModalProps> = (props) => {
    const { t } = useTranslation();
    const {
        styles,
        isOpen,
        onDismiss,
        defaultPageKey = TutorialModalPage.INTRODUCTION
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
            <div className={classNames.root}>
                <div className={classNames.header}>
                    <div className={classNames.headerTextContainer}>
                        <span id={titleId} className={classNames.headerText}>
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
                        {state.pageKey === TutorialModalPage.INTRODUCTION ? (
                            <IntroductionSlideShow
                                slideNumber={state.slideNumber}
                                setSlideNumber={(slideNumber) =>
                                    dispatch({
                                        type: TutorialModalActionType.SET_SLIDE,
                                        slide: slideNumber
                                    })
                                }
                                classNames={classNames}
                            />
                        ) : (
                            <ConceptPage pageKey={state.pageKey} />
                        )}
                    </div>
                </div>
                <div className={classNames.footer}>
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <Link
                            href={FRE_MODAL_LINKS.viewTheDocs}
                            target="_blank"
                        >
                            {t('tutorialModal.viewTheDocs')}
                        </Link>{' '}
                        <Text block>|</Text>{' '}
                        <Link
                            href={FRE_MODAL_LINKS.viewOnGithub}
                            target="_blank"
                        >
                            {t('tutorialModal.viewOnGithub')}
                        </Link>
                        <Text block>|</Text>{' '}
                        <Link
                            href={FRE_MODAL_LINKS.viewTheQuickstart}
                            target="_blank"
                        >
                            {t('tutorialModal.viewTheQuickstart')}
                        </Link>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <PrimaryButton
                            onClick={() => window.open(scenesDemoUrl, '_blank')}
                        >
                            {t('tutorialModal.exploreTheDemo')}
                        </PrimaryButton>
                        <DefaultButton onClick={onDismiss}>
                            {t('tutorialModal.dismiss')}
                        </DefaultButton>
                    </Stack>
                </div>
            </div>
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
                            icon: 'Ringer',
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
                            icon: 'Link',
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
                            icon: 'SpeedHigh',
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
                            icon: 'MapLayers',
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

export default styled<
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles
>(TutorialModal, getStyles);
