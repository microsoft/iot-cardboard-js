import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-model`;
const classNames = {
    container: `${classPrefix}-container`,
    modelNode: `${classPrefix}-model-node`,
    modelNodeSelected: `${classPrefix}-model-node-selected`,
    modelNodeButtonContent: `${classPrefix}-model-node-button-content`,
    nodeCancel: `${classPrefix}-nodeCancel`,
    strongText: `${classPrefix}-strong-text`,
    searchText: `${classPrefix}-searchText`,
    placeholderText: `${classPrefix}-placeholder-text`
};

export const getModelsStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                backgroundColor: theme.semanticColors.bodyBackground,
                width: '100%',
                maxHeight: 'calc(100vh - 100px)',
                height: '100%',
                overflowX: 'hidden',
                '::-webkit-scrollbar': {
                    width: '0px',
                    opacity: '0'
                }
            } as IStyle
        ],
        modelNode: [
            classNames.modelNode,
            {
                width: '95%',
                height: 'fit-content',
                display: 'grid',
                marginLeft: '2%',
                marginRight: '3%',
                gridTemplateColumns: '94% 5%',
                border: `1px solid ${theme.semanticColors.bodyDivider}`,
                padding: '5px',
                marginBottom: '10px'
            } as IStyle
        ],
        modelNodeSelected: [
            classNames.modelNodeSelected,
            {
                border: `2px solid ${theme.semanticColors.focusBorder}`,
                borderRadius: '2px'
            } as IStyle
        ],
        modelNodeButtonContent: [
            classNames.modelNodeButtonContent,
            {
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            } as IStyle
        ],
        nodeCancel: [
            classNames.nodeCancel,
            {
                height: FontSizes.size12,
                width: 'fit-content',
                position: 'relative',
                zIndex: '101',
                float: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 0
            } as IStyle
        ],
        regularText: [
            classNames.strongText,
            {
                textAlign: 'left',
                float: 'left',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minHeight: '17px'
            } as IStyle
        ],
        placeholderText: [
            classNames.placeholderText,
            {
                textAlign: 'left',
                float: 'left',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minHeight: '17px',
                color: theme.semanticColors.inputPlaceholderText,
                opacity: '.9'
            } as IStyle
        ],
        strongText: [
            classNames.strongText,
            {
                textAlign: 'left',
                float: 'left',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            } as IStyle
        ],
        searchText: [
            classNames.searchText,
            {
                marginLeft: '2%',
                marginRight: '3%',
                marginBottom: '10px'
            } as IStyle
        ]
    });
};
