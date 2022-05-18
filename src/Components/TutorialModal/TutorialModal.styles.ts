import { FontSizes, FontWeights, IStyle } from '@fluentui/react';
import {
    ITutorialModalStyleProps,
    ITutorialModalStyles
} from './TutorialModal.types';

export const classPrefix = 'cb-tutorialmodal';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    headerText: `${classPrefix}-header-text`,
    previewBadge: `${classPrefix}-preview-badge`,
    body: `${classPrefix}-body`,
    contentPane: `${classPrefix}-content-pane`,
    slideshowContainer: `${classPrefix}-slideshow-container`,
    slideChangeBtnContainerLeft: `${classPrefix}-slide-change-btn-container-left`,
    slideChangeBtnContainerRight: `${classPrefix}-slide-change-btn-container-right`,
    slideStatusIndicatorContainer: `${classPrefix}-slide-status-indicator-container`,
    footer: `${classPrefix}-footer`,
    navContainer: `${classPrefix}-nav-container`
};

const slideChangeBtnContainerBaseStyles: IStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
        headerText: [
            classNames.headerText,
            {
                display: 'flex'
            } as IStyle
        ],
        previewBadge: [
            classNames.previewBadge,
            {
                borderRadius: 4,
                border: `1px solid ${props.theme.palette.black}`,
                filter: `brightness(75%)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: FontSizes.size12,
                fontWeight: FontWeights.regular,
                marginLeft: 12,
                padding: '2px 6px'
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
        slideshowContainer: [
            classNames.slideshowContainer,
            {
                width: '100%',
                height: '100%',
                position: 'relative'
            } as IStyle
        ],
        slideChangeBtnContainerLeft: [
            classNames.slideChangeBtnContainerLeft,
            slideChangeBtnContainerBaseStyles,
            {
                left: '0px'
            } as IStyle
        ],
        slideChangeBtnContainerRight: [
            classNames.slideChangeBtnContainerRight,
            slideChangeBtnContainerBaseStyles,
            {
                right: '0px'
            } as IStyle
        ],
        slideStatusIndicatorContainer: [
            classNames.slideStatusIndicatorContainer,
            {
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
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
            chevronButton: {
                root: {
                    color: props.theme.palette.neutralPrimary
                },
                icon: {
                    fontSize: FontSizes.xLarge
                },
                rootDisabled: {
                    backgroundColor: props.theme.palette.white
                },
                iconDisabled: {
                    color: props.theme.palette.white
                }
            },
            slideIndicatorButton: {
                icon: {
                    fontSize: FontSizes.small
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
