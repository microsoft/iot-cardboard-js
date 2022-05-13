import { IStyle, mergeStyleSets, useTheme } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    component: `${classPrefix}-component`,
    componentTemplate: `${classPrefix}-component-template`
};
export const getEditorPageStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [classNames.container, {} as IStyle],
        component: [
            classNames.component,
            {
                display: 'grid',
                gridTemplateColumns: '20% 55% 25%',
                height: '100vh',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        componentTemplate: [
            classNames.componentTemplate,
            {
                display: 'grid',
                gridTemplateColumns: '20% 30% 50%'
            } as IStyle
        ]
    });
};
2;
