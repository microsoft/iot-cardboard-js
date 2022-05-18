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
    Icon
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { scenesDemoUrl } from '../../Models/Constants';
import IntroductionSlideShow from './Internal/IntroductionSlideShow';
import {
    defaultTutorialModalState,
    tutorialModalReducer
} from './TutorialModal.state';
import ConceptPage from './Internal/ConceptPage';

const getClassNames = classNamesFunction<
    ITutorialModalStyleProps,
    ITutorialModalStyles
>();

const TutorialModal: React.FC<ITutorialModalProps> = (props) => {
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

    const navLinkGroups = getNavLinkGroups(dispatch);

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
                    <div className={classNames.headerText}>
                        <span id={titleId}>Welcome to 3D Scenes Studio!</span>
                        <div className={classNames.previewBadge}>
                            <Icon
                                iconName="Globe"
                                styles={{ root: { marginRight: 4 } }}
                            />
                            Public Preview
                        </div>
                    </div>
                    <IconButton
                        styles={classNames.subComponentStyles.closeButton()}
                        iconProps={{ iconName: 'Cancel' }}
                        ariaLabel="Close popup modal"
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
                    <Link href="https://google.com" target="_blank">
                        View the docs
                    </Link>
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <PrimaryButton
                            onClick={() => window.open(scenesDemoUrl, '_blank')}
                        >
                            Explore the demo
                        </PrimaryButton>
                        <DefaultButton onClick={onDismiss}>
                            Dismiss
                        </DefaultButton>
                    </Stack>
                </div>
            </div>
        </Modal>
    );
};

const getNavLinkGroups = (
    dispatch: React.Dispatch<TutorialModalAction>
): INavLinkGroup[] => {
    return [
        {
            links: [
                {
                    key: TutorialModalPage.INTRODUCTION,
                    name: 'Introduction',
                    icon: 'CRMCustomerInsightsApp',
                    url: '',
                    onClick: () =>
                        dispatch({
                            type: TutorialModalActionType.SET_PAGE,
                            pageKey: TutorialModalPage.INTRODUCTION
                        })
                },
                {
                    key: TutorialModalPage.CONCEPTS,
                    name: 'Concepts',
                    icon: 'Zoom',
                    url: '',
                    onClick: () =>
                        dispatch({
                            type: TutorialModalActionType.SET_PAGE,
                            pageKey: TutorialModalPage.CONCEPTS
                        }),
                    isExpanded: true,
                    forceAnchor: true,
                    links: [
                        {
                            key: TutorialModalPage.ELEMENTS,
                            name: 'Elements',
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
                            name: 'Behaviors',
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
                            name: 'Twins',
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
                            name: 'Widgets',
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
                            name: 'Scene layers',
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
