import {
    ICustomGraphNodeStyleProps,
    ICustomGraphNodeStyles
} from './CustomGraphNode.types';
import { memoizeFunction } from '@fluentui/utilities';
import { FontSizes, FontWeights } from '@fluentui/theme';

export const getStyles = memoizeFunction(
    (_props: ICustomGraphNodeStyleProps): ICustomGraphNodeStyles => {
        return {
            rootRect: {
                width: 400,
                height: 'auto',
                fill: '#fff',
                stroke: '#ddd',
                shadowColor: '#eee',
                shadowBlur: 30,
                radius: [4],
                justifyContent: 'center',
                padding: [8, 0]
            },
            nameText: {
                fill: '#000', // theme.semanticColors.bodyText,
                margin: [0, 24],
                fontSize: FontSizes.medium,
                fontWeight: FontWeights.semibold
            },
            idText: {
                fill: '#111', // theme.semanticColors.accentButtonText,
                fontSize: FontSizes.medium,
                margin: [12, 24]
            }
        };
    }
);
