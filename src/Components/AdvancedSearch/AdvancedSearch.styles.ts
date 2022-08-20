import {
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
} from './AdvancedSearch.types';

export const classPrefix = 'cb-advancedsearch';
const classNames = {
    content: `${classPrefix}-content`,
    header: `${classPrefix}-header`,
    headerText: `${classPrefix}-headerText`,
    mainHeader: `${classPrefix}-mainHeader`,
    subtitle: `${classPrefix}-subtitle`,
    queryContainer: `${classPrefix}-queryContainer`,
    resultsContainer: `${classPrefix}-resultsContainer`
};

export const getStyles = (
    _props: IAdvancedSearchStyleProps
): IAdvancedSearchStyles => {
    return {
        content: [
            classNames.content,
            {
                display: 'flex',
                flexDirection: 'column',
                height: 550
            }
        ],
        header: [classNames.header],
        headerText: [
            classNames.headerText,
            {
                margin: 0,
                fontSize: '24px'
            }
        ],
        mainHeader: [
            classNames.mainHeader,
            {
                display: 'flex'
            }
        ],
        subtitle: [classNames.subtitle],
        queryContainer: [classNames.queryContainer],
        resultsContainer: [
            classNames.resultsContainer,
            {
                overflow: 'auto'
            }
        ],
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
                    alignSelf: 'center',
                    paddingRight: 12,
                    fontSize: 20
                }
            }
        }
    };
};
