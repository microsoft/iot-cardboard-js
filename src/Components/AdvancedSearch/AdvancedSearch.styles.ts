import { FontSizes } from '@fluentui/react';
import {
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
} from './AdvancedSearch.types';

export const getStyles = (
    _props: IAdvancedSearchStyleProps
): IAdvancedSearchStyles => {
    return {
        subComponentStyles: {
            icon: {
                root: {
                    textAlign: 'center',
                    alignSelf: 'center',
                    paddingRight: 12,
                    paddingTop: 8,
                    fontSize: FontSizes.size20
                }
            },
            advancedSearchDetailsList: {
                root: {
                    overflow: 'auto'
                }
            }
        }
    };
};
