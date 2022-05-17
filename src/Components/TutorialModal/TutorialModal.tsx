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
    DefaultButton
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { scenesDemoUrl } from '../../Models/Constants';
import IntroductionSlider from './Internal/IntroductionSlider';
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
    const { styles, isOpen, onDismiss } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const titleId = useId('tutorial-modal-title');
    const [state, dispatch] = useReducer(
        tutorialModalReducer,
        defaultTutorialModalState
    );

    const navLinkGroups = getNavLinkGroups(dispatch);

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={() => onDismiss()}
            titleAriaId={titleId}
            styles={{
                main: { overflow: 'hidden', display: 'flex' }
            }}
        >
            <div className={classNames.root}>
                <div className={classNames.header}>
                    <span id={titleId}>Welcome to 3D Scenes Studio!</span>
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
                            styles={classNames.subComponentStyles.nav}
                        />
                    </div>
                    <div className={classNames.contentPane}>
                        {state.pageKey === TutorialModalPage.INTRODUCTION ? (
                            <IntroductionSlider
                                slideNumber={state.slideNumber}
                                setSliderNumber={(slideNumber) =>
                                    dispatch({
                                        type: TutorialModalActionType.SET_SLIDE,
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
                    <Link href="https://google.com" target="_blank">
                        Learn more
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
