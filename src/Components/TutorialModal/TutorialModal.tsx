import React from 'react';
import {
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles
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
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={() => onDismiss()}
            titleAriaId={titleId}
            styles={{
                main: { overflow: 'hidden' }
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
                    <div className={classNames.contentPane}>Content pane</div>
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

const navLinkGroups: INavLinkGroup[] = [
    {
        links: [
            {
                key: 'introduction',
                name: 'Introduction',
                url: '',
                onClick: () => null
            },
            {
                key: 'concepts',
                name: 'Concepts',
                url: '',
                onClick: () => null,
                isExpanded: true,
                forceAnchor: true,
                links: [
                    {
                        key: 'elements',
                        name: 'Elements',
                        url: '',
                        onClick: () => null
                    },
                    {
                        key: 'behaviors',
                        name: 'Behaviors',
                        url: '',
                        onClick: () => null
                    },
                    {
                        key: 'aliases',
                        name: 'Aliases',
                        url: '',
                        onClick: () => null
                    },
                    {
                        key: 'widgets',
                        name: 'Widgets',
                        url: '',
                        onClick: () => null
                    }
                ]
            }
        ]
    }
];

export default styled<
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles
>(TutorialModal, getStyles);
