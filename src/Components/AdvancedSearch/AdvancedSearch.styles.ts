import {
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
} from './AdvancedSearch.types';

export const classPrefix = 'cb-advancedsearch';
const classNames = {
    content: `${classPrefix}-content`,
    header: `${classPrefix}-header`,
    headerText: `${classPrefix}-headerText`,
    queryContainer: `${classPrefix}-queryContainer`,
    resultsContainer: `${classPrefix}-resultsContainer`
};

export const getStyles = (
    _props: IAdvancedSearchStyleProps
): IAdvancedSearchStyles => {
    return {
        content: [classNames.content],
        header: [
            classNames.header,
            {
                display: 'flex',
                // TODO: Remove this margin when modal contents are done
                marginBottom: 150
            }
        ],
        headerText: [
            classNames.headerText,
            {
                margin: 0
            }
        ],
        queryContainer: [
            classNames.queryContainer,
            {
                // TODO: Remove this height when modal contents are done
                height: 200
            }
        ],
        resultsContainer: [
            classNames.resultsContainer,
            {
                // TODO: Remove this height when modal contents are done
                height: 200
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
