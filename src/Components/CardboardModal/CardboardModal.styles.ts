import { FontSizes, FontWeights } from '@fluentui/react';
import {
    ICardboardModalStyleProps,
    ICardboardModalStyles
} from './CardboardModal.types';

export const classPrefix = 'cb-oat-modal';
const classNames = {
    content: `${classPrefix}-content`,
    footer: `${classPrefix}-footer`,
    headerContainer: `${classPrefix}-headerContainer`,
    subtitle: `${classPrefix}-subtitle`,
    title: `${classPrefix}-title`,
    titleContainer: `${classPrefix}-titleContainer`
};
export const getStyles = (
    props: ICardboardModalStyleProps
): ICardboardModalStyles => {
    const { isDestructiveFooterActionVisible, theme } = props;
    console.log('***Is destructive', isDestructiveFooterActionVisible);
    return {
        content: [
            classNames.content,
            {
                height: '100%',
                overflow: 'auto'
            }
        ],
        footer: [classNames.footer],
        headerContainer: [classNames.headerContainer],
        title: [
            classNames.title,
            {
                margin: 0,
                fontSize: FontSizes.size24,
                fontWeight: FontWeights.semibold
            }
        ],
        titleContainer: [
            classNames.titleContainer,
            {
                display: 'flex',
                paddingBottom: 8
            }
        ],
        subtitle: [classNames.subtitle],
        subComponentStyles: {
            destructiveButton: {
                root: {
                    backgroundColor: 'transparent',
                    borderColor: 'var(--cb-color-text-danger)',
                    color: 'var(--cb-color-text-danger)'
                },
                rootHovered: {
                    backgroundColor: 'var(--cb-color-text-danger)',
                    borderColor: theme.palette.white,
                    color: theme.palette.white
                },
                rootFocused: {
                    backgroundColor: 'var(--cb-color-text-danger)',
                    borderColor: theme.palette.white,
                    color: theme.palette.white
                },
                rootPressed: {
                    backgroundColor: 'var(--cb-color-text-danger)',
                    borderColor: theme.palette.white,
                    color: theme.palette.white
                }
            },
            footerStack: {
                root: {
                    justifyContent: isDestructiveFooterActionVisible
                        ? 'space-between !important'
                        : 'end'
                }
            },
            modal: {
                main: {
                    height: 690,
                    width: 940,
                    padding: 20
                },
                scrollableContent: {
                    height: '100%'
                }
            },
            icon: {
                root: {
                    textAlign: 'center',
                    alignSelf: 'center',
                    paddingRight: 12,
                    paddingTop: 8,
                    fontSize: FontSizes.size20
                }
            }
        }
    };
};
