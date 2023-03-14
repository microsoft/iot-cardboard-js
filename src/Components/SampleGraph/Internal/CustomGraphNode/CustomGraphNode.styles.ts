import {
    ICustomGraphNodeStyleProps,
    ICustomGraphNodeStyles
} from './CustomGraphNode.types';
import { memoizeFunction } from '@fluentui/utilities';

export const getStyles = memoizeFunction(
    (_props: ICustomGraphNodeStyleProps): ICustomGraphNodeStyles => {
        return {
            rootRect: {
                fill: '#fff',
                height: 'auto',
                justifyContent: 'center',
                padding: [8, 0],
                radius: [4],
                shadowBlur: 30,
                shadowColor: '#eee',
                stroke: '#ddd',
                width: 400
            },
            nameText: {
                fill: '#000', // theme.semanticColors.bodyText,
                fontSize: '14px',
                fontWeight: 'semi-bold',
                margin: [0, 24]
            },
            idText: {
                fill: '#111', // theme.semanticColors.accentButtonText,
                fontSize: '14px',
                margin: [12, 24]
            }
        };
    }
);
