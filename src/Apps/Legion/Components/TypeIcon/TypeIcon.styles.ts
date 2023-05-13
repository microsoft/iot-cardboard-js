import { ITypeIconStyles } from './TypeIcon.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction,
    FontSizes
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (color: string): IProcessedStyleSet<ITypeIconStyles> => {
        return mergeStyleSets({
            root: {
                display: 'inline-flex',
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
            },
            icon: {
                color: 'white',
                fontSize: FontSizes.size12
            }
        });
    }
);
