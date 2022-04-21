import { IStyle, mergeStyleSets } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    component: `${classPrefix}-component`,
    componentTemplate: `${classPrefix}-component-template`
};
export const getEditorPageStyles = () => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                height: '10%'
            } as IStyle
        ],
        component: [
            classNames.component,
            {
                display: 'grid',
                gridTemplateColumns: '20% 55% 25%',
                height: '90%'
            } as IStyle
        ],
        componentTemplate: [
            classNames.componentTemplate,
            {
                display: 'grid',
                gridTemplateColumns: '20% 30% 50%',
                height: '90%'
            } as IStyle
        ]
    });
};
2;
