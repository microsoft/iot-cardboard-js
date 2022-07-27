import { FontWeights, IStyle, ITextStyles } from '@fluentui/react';
import { HEADER_BUTTON_HEIGHT } from '../../../../Models/Constants/StyleConstants';
import { GET_HEADER_BUTTON_STYLES } from '../../../HeaderControlButton/HeaderControlButton.styles';
import {
    IPrimaryActionCalloutContentsStyleProps,
    IPrimaryActionCalloutContentsStyles,
    ISceneLayersStyleProps,
    ISceneLayersStyles
} from './SceneLayers.types';
export const getStyles = (
    props: ISceneLayersStyleProps
): ISceneLayersStyles => {
    const { theme, isFlyoutOpen } = props;
    const headerButton = GET_HEADER_BUTTON_STYLES(theme, isFlyoutOpen);
    return {
        subComponentStyles: {
            button: {
                subComponentStyles: {
                    button: {
                        ...headerButton,
                        root: [
                            headerButton.root,
                            {
                                border: `1px solid ${theme.palette.neutralLight}`,
                                height: HEADER_BUTTON_HEIGHT,
                                width: 'fit-content'
                            }
                        ]
                    }
                }
            }
        }
    };
};

export const primaryContentClassPrefix = 'cb-scene-layers-primary-content';
const primaryContentClassNames = {
    container: `${primaryContentClassPrefix}-container`,
    body: `${primaryContentClassPrefix}-body`,
    footer: `${primaryContentClassPrefix}-footer`
};
export const getPrimaryContentStyles = (
    _props: IPrimaryActionCalloutContentsStyleProps
): IPrimaryActionCalloutContentsStyles => {
    return {
        container: [
            primaryContentClassNames.container,
            {
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            } as IStyle
        ],
        footer: [
            primaryContentClassNames.footer,
            {
                width: '100%',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid var(--cb-color-modal-border)',
                paddingLeft: 20
            } as IStyle
        ],
        body: [
            primaryContentClassNames.body,
            {
                minHeight: 100,
                maxHeight: 220,
                flexGrow: 1,
                overflowY: 'auto',
                padding: 20,
                paddingTop: 8
            } as IStyle
        ],
        subComponentStyles: {
            stack: {
                root: {
                    width: 'fit-content'
                }
            }
        }
    };
};

export const sectionHeaderStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.semibold,
        marginBottom: 8,
        marginTop: 4,
        display: 'block'
    }
};

export const noLayersDescriptionStyles: Partial<ITextStyles> = {
    root: {
        textAlign: 'center',
        width: '80%'
    }
};
