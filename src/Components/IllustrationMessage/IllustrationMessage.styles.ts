import { FontWeights, IStyle } from '@fluentui/react';
import {
    IllustrationMessageStyleProps,
    IllustrationMessageStyles
} from './IllustrationMessage.types';

export const getIllustrationMessageStyles = (
    props: IllustrationMessageStyleProps
): IllustrationMessageStyles => {
    return {
        container: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 20,
            fontFamily: 'Segoe UI'
        } as IStyle,
        descriptionContainer: [
            props.width === 'compact' && {
                maxWidth: 200
            },
            {
                textAlign: 'center',
                marginBottom: 16
            }
        ],
        subComponentStyles: {
            header: {
                root: [
                    props.type === 'error' && {
                        color: '#cb2431'
                    },
                    {
                        fontWeight: FontWeights.semibold,
                        fontSize: 14,
                        marginBottom: 8,
                        marginTop: 4,
                        display: 'block'
                    }
                ]
            },
            description: {
                root: {
                    textAlign: 'center',
                    fontSize: 12,
                    width: '80%',
                    paddingRight: 2
                }
            },
            image: {
                root: { marginBottom: 8 }
            },
            button: {},
            link: {
                root: {
                    fontSize: 12
                }
            }
        }
    };
};
