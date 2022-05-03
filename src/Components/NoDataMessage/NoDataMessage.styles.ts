import { FontWeights, IStyle } from '@fluentui/react';
import { NoDataMessageStyles } from './NoDataMessage.types';

export const noDataMessageClassPrefix = 'cb-no-data-message';

const classNames = {
    container: `${noDataMessageClassPrefix}-container`
};

export const getNoDataMessageStyles = (): NoDataMessageStyles => {
    return {
        container: [
            classNames.container,
            {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: 20
            } as IStyle
        ],
        subComponentStyles: {
            header: {
                root: {
                    fontWeight: FontWeights.semibold,
                    fontSize: 14,
                    marginBottom: 8,
                    marginTop: 4,
                    display: 'block'
                }
            },
            description: {
                root: {
                    textAlign: 'center',
                    fontSize: 12,
                    width: '80%'
                }
            },
            image: {
                root: { marginBottom: 8 }
            }
        }
    };
};
