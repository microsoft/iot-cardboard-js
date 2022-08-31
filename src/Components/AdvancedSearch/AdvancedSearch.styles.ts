import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
} from './AdvancedSearch.types';

export const classPrefix = 'cb-advancedsearch';
const classNames = {
    content: `${classPrefix}-content`,
    headerContainer: `${classPrefix}-headerContainer`,
    headerText: `${classPrefix}-headerText`,
    subtitle: `${classPrefix}-subtitle`,
    titleContainer: `${classPrefix}-titleContainer`
};

export const getStyles = (
    _props: IAdvancedSearchStyleProps
): IAdvancedSearchStyles => {
    return {
        content: [classNames.content],
        headerContainer: [classNames.headerContainer],
        headerText: [
            classNames.headerText,
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
