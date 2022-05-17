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
    INavLinkGroup
} from '@fluentui/react';

const getClassNames = classNamesFunction<
    ITutorialModalStyleProps,
    ITutorialModalStyles
>();

const TutorialModal: React.FC<ITutorialModalProps> = (props) => {
    const { styles, isOpen, onDismiss } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Modal isOpen={isOpen} onDismiss={() => onDismiss()}>
                <Nav groups={navLinkGroups} />
            </Modal>
        </div>
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
                onClick: () => null
            }
        ]
    }
];

export default styled<
    ITutorialModalProps,
    ITutorialModalStyleProps,
    ITutorialModalStyles
>(TutorialModal, getStyles);
