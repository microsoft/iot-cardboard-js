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
    _props: ICardboardModalStyleProps
): ICardboardModalStyles => {
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
