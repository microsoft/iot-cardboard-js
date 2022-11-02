import {
    ActionButton,
    Callout,
    IStyleFunctionOrObject,
    Link,
    Text,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// import ConnectionErrorImg from '../../../Resources/Static/connectionError.svg';
// import PermissionErrorImg from '../../Resources/Static/priviledgedAccess.svg';
// import GenericErrorImg from '../../../Resources/Static/noResults.svg';
import { DOCUMENTATION_LINKS } from '../../../../../../Models/Constants/Constants';
import { IComponentError } from '../../../../../../Models/Constants/Interfaces';
import { getActionButtonStyles } from '../../../../../ADT3DSceneBuilder/Internal/Shared/LeftPanel.styles';
import { getCardboardListCalloutStyles } from '../../../../../CardboardListCallout/CardboardListCallout.styles';
import { getDataHistoryWidgetClassNames } from '../DataHistoryWidget';
import {
    ConnectionErrors,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from '../DataHistoryWidget.types';

interface IDataHistoryWidgetErrorHandlingProps {
    errors: Array<IComponentError>;
    styles?: IStyleFunctionOrObject<
        IDataHistoryWidgetStyleProps,
        IDataHistoryWidgetStyles
    >;
}

export const DataHistoryWidgetErrorHandling: React.FC<IDataHistoryWidgetErrorHandlingProps> = ({
    errors,
    styles
}) => {
    const [
        isDetailsCalloutVisible,
        { toggle: toggleIsDetailsCalloutVisible }
    ] = useBoolean(false);
    const { t } = useTranslation();

    const requestStatus = (errors[0].rawError as any).request.status;
    const response = (errors[0].rawError as any).response;
    let errorSummary = '';

    if (requestStatus === 0) {
        // e.g. with network error of ERR_NAME_NOT_RESOLVED due to invalid request url or connection error
        errorSummary = t('widgets.dataHistory.errors.genericNetwork');
    } else if (requestStatus === 400) {
        switch (response.data?.error.code) {
            case ConnectionErrors.General_BadRequest:
                errorSummary = `${t(
                    'widgets.dataHistory.errors.generalBadRequestMessage'
                )} ${response.data?.error.innererror.message}`;
                break;
            case ConnectionErrors.BadRequest_EntityNotFound:
                errorSummary = t('widgets.dataHistory.errors.entityNotFound');
                break;
            default:
                errorSummary = t(
                    'widgets.dataHistory.errors.genericBadRequest'
                );
                break;
        }
    } else {
        errorSummary = t('widgets.dataHistory.errors.genericBadRequest');
    }

    const theme = useTheme();
    const classNames = getDataHistoryWidgetClassNames(styles, { theme });
    const sharedActionButtonStyles = getActionButtonStyles(theme);
    const sharedCalloutStyles = getCardboardListCalloutStyles(theme);

    const errorDetailsCalloutId = useId('show-error-details-button');
    const errorDetailsCalloutDescriptionId = useId(
        'error-details-callout-description'
    );
    const errorDetails = useMemo(() => {
        if (response?.data?.error.innererror?.message) {
            return (
                <>
                    <ActionButton
                        id={errorDetailsCalloutId}
                        styles={sharedActionButtonStyles}
                        text={
                            isDetailsCalloutVisible
                                ? t('hideDetails')
                                : t('showDetails')
                        }
                        onClick={toggleIsDetailsCalloutVisible}
                    />
                    {isDetailsCalloutVisible && (
                        <Callout
                            ariaDescribedBy={errorDetailsCalloutDescriptionId}
                            styles={sharedCalloutStyles}
                            target={`#${errorDetailsCalloutId}`}
                            onDismiss={toggleIsDetailsCalloutVisible}
                            role="alert"
                        >
                            <Text
                                block
                                variant="small"
                                id={errorDetailsCalloutDescriptionId}
                            >
                                {response?.data?.error.innererror?.message}
                            </Text>
                            <Link
                                target="_blank"
                                href={DOCUMENTATION_LINKS.dataHistory}
                            >
                                {t('learnMore')}
                            </Link>
                        </Callout>
                    )}
                </>
            );
        } else {
            return null;
        }
    }, [response?.data?.error.innererror?.message, isDetailsCalloutVisible]);

    return (
        <div className={classNames.errorContainer}>
            <span>{errorSummary}</span>
            {errorDetails}
        </div>
    );
};
