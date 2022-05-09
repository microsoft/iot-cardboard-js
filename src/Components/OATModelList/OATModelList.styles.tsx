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
                border: '1px',
                borderColor: theme.semanticColors.bodyDivider,
                borderStyle: 'solid',
                backgroundColor: theme.semanticColors.bodyBackground,
                padding: '5px',
                margin: '5px'
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
