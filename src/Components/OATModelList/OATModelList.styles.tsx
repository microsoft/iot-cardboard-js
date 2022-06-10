import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-model`;
const classNames = {
    container: `${classPrefix}-container`,
    modelNode: `${classPrefix}-model-node`,
    nodeCancel: `${classPrefix}-nodeCancel`,
    strongText: `${classPrefix}-strong-text`,
    searchText: `${classPrefix}-searchText`
};

export const getModelsStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                backgroundColor: theme.semanticColors.bodyBackground,
                width: '107%',
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'scroll',
                right: '-7%'
            } as IStyle
        ],
        modelNode: [
            classNames.modelNode,
            {
                width: '100%',
                height: '60px',
                display: 'grid',
                gridTemplateColumns: '90% 5%'
            } as IStyle
        ],
        nodeCancel: [
            classNames.nodeCancel,
            {
                height: FontSizes.size12,
                position: 'relative',
                marginTop: '5px',
                marginLeft: '17%',
                zIndex: '101',
                float: 'right'
            } as IStyle
        ],
        strongText: [
            classNames.strongText,
            {
                float: 'left'
            } as IStyle
        ],
        searchText: [
            classNames.searchText,
            {
                marginLeft: '2%',
                marginRight: '3%'
            } as IStyle
        ]
    });
};

export const getModelsIconStyles: IStyle = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size10,
            color: theme.semanticColors.actionLink
        }
    } as Partial<IStyle>;
};

export const getModelsActionButtonStyles: IStyle = () => {
    const theme = useTheme();
    return {
        root: {
            border: '1px',
            borderColor: theme.semanticColors.bodyDivider,
            borderStyle: 'solid',
            padding: '5px',
            margin: '5px',
            width: '105%',
            height: '50px',
            position: 'relative'
        }
    } as Partial<IStyle>;
};
