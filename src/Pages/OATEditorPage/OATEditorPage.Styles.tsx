import { IStyle, mergeStyleSets } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    component: `${classPrefix}-component`
};
export const getEditorPageStyles = () => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                display: 'grid',
                gridTemplateColumns: '100%',
                height: '10%'
            } as IStyle
        ],
        component: [
            classNames.component,
            {
                display: 'grid',
                gridTemplateColumns: '20% 60% 20%',
                height: '90%'
            } as IStyle
        ]
    });
};
