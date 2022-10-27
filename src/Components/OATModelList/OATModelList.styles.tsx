import { CardboardClassNamePrefix } from '../../Models/Constants';
import {
    IOATModelListStyleProps,
    IOATModelListStyles
} from './OATModelList.types';

const classPrefix = `${CardboardClassNamePrefix}-oat-model-list`;
const classNames = {
    root: `${classPrefix}-root`,
    listContainer: `${classPrefix}-container`,
    modelNode: `${classPrefix}-model-node`,
    modelNodeSelected: `${classPrefix}-model-node-selected`,
    modelNodeButtonContent: `${classPrefix}-model-node-button-content`,
    nodeCancel: `${classPrefix}-nodeCancel`,
    strongText: `${classPrefix}-strong-text`,
    searchText: `${classPrefix}-searchText`,
    placeholderText: `${classPrefix}-placeholder-text`
};
export const getStyles = (
    props: IOATModelListStyleProps
): IOATModelListStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        listContainer: [
            classNames.listContainer,
            {
                backgroundColor: theme.semanticColors.bodyBackground,
                width: '100%',
                height: 'calc(100% - 32px)', // less the search box
                overflowX: 'hidden',
                overflowY: 'auto'
            }
        ],
        subComponentStyles: {
            rootStack: {
                root: {
                    height: '100%',
                    overflow: 'hidden'
                }
            },
            searchbox: {
                root: {
                    marginLeft: 4,
                    marginRight: 4
                }
            }
        }
    };
};
