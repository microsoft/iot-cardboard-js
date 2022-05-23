import { IStyle, mergeStyleSets, useTheme } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    errorContainer: `${classPrefix}-error-container`,
    component: `${classPrefix}-component`,
    componentTemplate: `${classPrefix}-component-template`,
    errorPageHeader: `${classPrefix}-error-page-header`,
    errorPageMessageHeader: `${classPrefix}-error-page-message-header`,
    errorPageStackHeader: `${classPrefix}-error-page-stack-header`
};
export const getEditorPageStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [classNames.container, {} as IStyle],
        errorContainer: [
            classNames.errorContainer,
            {
                minHeight: '100%',
                minWidth: '500px',
                backgroundColor: theme.semanticColors.bodyBackground,
                padding: '20px'
            } as IStyle
        ],
        component: [
            classNames.component,
            {
                display: 'grid',
                gridTemplateColumns: '20% 55% 25%',
                height: '100%',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        componentTemplate: [
            classNames.componentTemplate,
            {
                display: 'grid',
                height: '100%',
                backgroundColor: theme.semanticColors.bodyBackground,
                gridTemplateColumns: '20% 30% 50%'
            } as IStyle
        ],
        errorPageHeader: [
            classNames.errorPageHeader,
            {
                marginTop: '0px',
                marginBottom: '32px'
            }
        ],
        errorPageMessageHeader: [
            classNames.errorPageMessageHeader,
            {
                marginBottom: '8px'
            }
        ],
        errorPageStackHeader: [
            classNames.errorPageStackHeader,
            {
                marginBottom: '8px'
            }
        ]
    });
};
2;
