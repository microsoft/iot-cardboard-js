import { ITypeIconStyles } from './TypeIcon.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (color: string): IProcessedStyleSet<ITypeIconStyles> => {
        return mergeStyleSets({
            root: {
                display: 'inline-flex',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: `#${color}`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
            },
            icon: {
                color: 'white'
            }
        });
    }
);
