import { IStyle, mergeStyleSets, useTheme } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import {
    CONTROLS_BOTTOM_OFFSET,
    CONTROLS_CALLOUT_OFFSET,
    CONTROLS_SIDE_OFFSET,
    CONTROLS_Z_INDEX,
    OAT_HEADER_HEIGHT,
    PROPERTY_EDITOR_WIDTH
} from '../../Models/Constants/OatStyleConstants';
import { HEADER_BUTTON_HEIGHT } from '../../Models/Constants/StyleConstants';

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
            width: '100%'
        },
        propertyEditorContainer: {
            position: 'absolute',
            right: CONTROLS_SIDE_OFFSET,
            bottom:
                CONTROLS_BOTTOM_OFFSET +
                HEADER_BUTTON_HEIGHT +
                CONTROLS_CALLOUT_OFFSET,
            zIndex: CONTROLS_Z_INDEX
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
