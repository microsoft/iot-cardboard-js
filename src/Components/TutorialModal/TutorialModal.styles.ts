import { FontWeights, IStyle } from '@fluentui/react';
import {
    ITutorialModalStyleProps,
    ITutorialModalStyles
} from './TutorialModal.types';

export const classPrefix = 'cb-tutorialmodal';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    body: `${classPrefix}-body`,
    contentPane: `${classPrefix}-content-pane`,
    footer: `${classPrefix}-footer`,
    navContainer: `${classPrefix}-nav-container`
};
export const getStyles = (
    props: ITutorialModalStyleProps
): ITutorialModalStyles => {
    return {
        root: [
            classNames.root,
            {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            } as IStyle
        ],
        header: [
            classNames.header,
            props.theme.fonts.large,
            {
                width: '100%',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px'
            } as IStyle
        ],
        body: [
            classNames.body,
            {
                display: 'flex',
                flex: '1 1 auto',
                width: 900,
                paddingRight: 20,
                paddingLeft: 20,
                minHeight: 348,
                maxHeight: 'calc(100% - 120px)',
                overflowY: 'auto'
            } as IStyle
        ],
        contentPane: [
            classNames.contentPane,
            {
                width: '100%',
                borderRadius: 4,
                marginLeft: 8
            } as IStyle
        ],
        footer: [
            classNames.footer,
            {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: 60,
                borderTop: `1px solid ${props.theme.palette.neutralLight}`,
                marginTop: 8,
                padding: '0 20px'
            } as IStyle
        ],
        navContainer: [
            classNames.navContainer,
            {
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                minWidth: 200
            } as IStyle
        ],
        subComponentStyles: {
            closeButton: {
                root: {
                    color: props.theme.palette.neutralPrimary,
                    marginLeft: 'auto',
                    marginTop: '4px',
                    marginRight: '2px'
                }
            },
            nav: {
                linkText: { color: props.theme.palette.black },
                chevronButton: {
                    display: 'none'
                }
            }
        }
    };
};
