import { FontWeights } from '@fluentui/react';
import {
    IllustrationMessageStyleProps,
    IllustrationMessageStyles
} from './IllustrationMessage.types';

export const getIllustrationMessageStyles = (
    props: IllustrationMessageStyleProps
): IllustrationMessageStyles => {
    return {
        container: [
            props.width === 'wide' && {
                height: '100%'
            },
            {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: 20
            }
        ],
        descriptionContainer: [
            {
                textAlign: 'center',
                marginBottom: 16,
                maxWidth: 400
            },
            props.width === 'compact' && {
                maxWidth: 200
            }
        ],
        subComponentStyles: {
            header: {
                root: [
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
