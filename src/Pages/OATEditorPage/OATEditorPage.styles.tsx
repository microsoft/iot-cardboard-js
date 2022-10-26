import { IStyle, mergeStyleSets, useTheme } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import { OAT_HEADER_HEIGHT } from '../../Models/Constants/OatStyleConstants';

const classPrefix = `${CardboardClassNamePrefix}-oat-body`;
const classNames = {
    container: `${classPrefix}-container`,
    errorContainer: `${classPrefix}-error-container`,
    component: `${classPrefix}-component`,
    componentTemplate: `${classPrefix}-component-template`,
    errorHandlingWrapper: `${classPrefix}-error-handling-wrapper`,
    errorHandlingWrapperErrorTitle: `${classPrefix}-error-handling-wrapper-error-title`,
    errorHandlingWrapperErrorMessage: `${classPrefix}-error-handling-wrapper-error-message`,
    errorPageHeader: `${classPrefix}-error-page-header`,
    errorPageMessageHeader: `${classPrefix}-error-page-message-header`,
    errorPageStackHeader: `${classPrefix}-error-page-stack-header`,
    confirmDeleteWrapper: `${classPrefix}-confirm-delete-wrapper`,
    confirmDeleteButtonsWrapper: `${classPrefix}-confirm-delete-buttons-wrapper`,
    confirmDeleteWrapperTitle: `${classPrefix}-confirm-delete-wrapper-title`
};

const PROPERTY_EDITOR_WIDTH = 340;
export const getEditorPageStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                height: '100vh',
                overflow: 'hidden'
            } as IStyle
        ],
        errorContainer: [
            classNames.errorContainer,
            {
                minHeight: '100vh',
                minWidth: '500px',
                backgroundColor: theme.semanticColors.bodyBackground,
                padding: '20px'
            }
        ],
        component: [
            classNames.component,
            {
                display: 'flex',
                backgroundColor: theme.semanticColors.bodyBackground,
                height: `calc(100% - ${OAT_HEADER_HEIGHT}px)`,
                position: 'relative'
            } as IStyle
        ],
        viewerContainer: {
            width: `calc(100% - ${PROPERTY_EDITOR_WIDTH}px)`
        },
        propertyEditorContainer: {
            width: PROPERTY_EDITOR_WIDTH
        },
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
                marginBottom: '20px',
                whiteSpace: 'pre-line'
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
        ],
        confirmDeleteWrapper: [
            classNames.confirmDeleteWrapper,
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
        confirmDeleteButtonsWrapper: [
            classNames.confirmDeleteButtonsWrapper,
            {
                display: 'grid',
                gridTemplateColumns: '40% 40%',
                width: '100%',
                columnGap: '20%',
                marginTop: '30%'
            } as IStyle
        ],
        confirmDeleteWrapperTitle: [
            classNames.confirmDeleteWrapperTitle,
            {
                color: theme.palette.black
            } as IStyle
        ]
    });
};
