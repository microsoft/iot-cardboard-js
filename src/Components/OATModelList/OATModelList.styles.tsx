import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-header`;
const classNames = {
    container: `${classPrefix}-container`,
    modelList: `${classPrefix}-model-list`,
    nodeCancel: `${classPrefix}-nodeCancel`
};

export const getModelsStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                backgroundColor: theme.semanticColors.bodyBackground,
                width: '100%',
                height: '100%'
            } as IStyle
        ],
        modelList: [
            classNames.modelList,
            {
                width: '100%'
            } as IStyle
        ],
        nodeCancel: [
            classNames.nodeCancel,
            {
                height: FontSizes.size12,
                float: 'right'
            } as IStyle
        ]
    });
};

export const getModelsIconStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size10,
            color: theme.semanticColors.actionLink
        }
    } as Partial<IStyle>;
};

export const getModelsActionButtonStyles = () => {
    const theme = useTheme();
    return {
        root: {
            border: '1px',
            borderColor: theme.semanticColors.bodyDivider,
            borderStyle: 'solid',
            padding: '5px',
            margin: '5px',
            width: '95%',
            height: '50px'
        }
    } as Partial<IStyle>;
};
