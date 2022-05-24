import { IStyle, mergeStyleSets, useTheme } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    component: `${classPrefix}-component`,
    componentTemplate: `${classPrefix}-component-template`,
    errorHandlingWrapper: `${classPrefix}-error-handling-wrapper`,
    errorHandlingWrapperErrorTitle: `${classPrefix}-error-handling-wrapper-error-title`,
    errorHandlingWrapperErrorMessage: `${classPrefix}-error-handling-wrapper-error-message`
};
export const getEditorPageStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                height: '100vh'
            } as IStyle
        ],
        component: [
            classNames.component,
            {
                display: 'grid',
                gridTemplateColumns: '20% 55% 25%',
                height: '95%', // 100% - header height
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
        errorHandlingWrapper: [
            classNames.errorHandlingWrapper,
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                padding: '20px',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        errorHandlingWrapperErrorTitle: [
            classNames.errorHandlingWrapperErrorTitle,
            {
                fontSize: '14px',
                marginBottom: '20px',
                color: theme.semanticColors.errorText
            } as IStyle
        ],
        errorHandlingWrapperErrorMessage: [
            classNames.errorHandlingWrapperErrorMessage,
            {
                fontSize: '14px',
                marginBottom: '20px'
            } as IStyle
        ]
    });
};
