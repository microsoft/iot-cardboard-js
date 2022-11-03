import {
    Callout,
    IStyleFunctionOrObject,
    Link,
    Text,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionErrorImg from '../../../../../../Resources/Static/connectionError.svg';
import PermissionErrorImg from '../../../../../../Resources/Static/priviledgedAccess.svg';
import GenericErrorImg from '../../../../../../Resources/Static/noResults.svg';
import { DOCUMENTATION_LINKS } from '../../../../../../Models/Constants/Constants';
import { IComponentError } from '../../../../../../Models/Constants/Interfaces';
import { getCardboardListCalloutStyles } from '../../../../../CardboardListCallout/CardboardListCallout.styles';
import IllustrationMessage from '../../../../../IllustrationMessage/IllustrationMessage';
import { getDataHistoryWidgetClassNames } from '../DataHistoryWidget';
import {
    DataHistoryErrors,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from '../DataHistoryWidget.types';

const IMG_HEIGHT = 56;
interface IDataHistoryWidgetErrorHandlingProps {
    errors: Array<IComponentError>;
    styles?: IStyleFunctionOrObject<
        IDataHistoryWidgetStyleProps,
        IDataHistoryWidgetStyles
    >;
}

/** This component surfaces some of the error messages based on:
 * 1- ADX connection information (cluster URL, database name, table name) in the data history widget configuration
 * 2- query string in the data history widget configuration
 * 3- permission to query
 * See a full list of errors returned by ADX service requests here: https://learn.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/kusto-data-client-errors and https://learn.microsoft.com/en-us/azure/data-explorer/error-codes
 */
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

    const errorObj: {
        description: string;
        imgSrc: string;
        details: string;
    } = useMemo(() => {
        let description = '';
        let imgSrc = '';
        let details = '';

        if (requestStatus === 0) {
            // e.g. with network error of ERR_NAME_NOT_RESOLVED due to invalid request url (including cluster url error) or connection error
            description = t('widgets.dataHistory.errors.genericNetwork');
            imgSrc = ConnectionErrorImg;
        } else if (requestStatus === 400) {
            switch (response.data?.error.code) {
                case DataHistoryErrors.General_BadRequest: // query error (including table name since it is part of query in the request payload)
                    description = t(
                        'widgets.dataHistory.errors.generalBadRequestMessage'
                    );
                    imgSrc = GenericErrorImg;
                    break;
                case DataHistoryErrors.BadRequest_EntityNotFound: // database error
                    description = t(
                        'widgets.dataHistory.errors.entityNotFound'
                    );
                    imgSrc = ConnectionErrorImg;
                    break;
                default:
                    description = t(
                        'widgets.dataHistory.errors.genericBadRequest'
                    );
                    imgSrc = GenericErrorImg;
                    break;
            }
            details = response.data?.error.innererror?.message;
        } else if (requestStatus === 403) {
            // permission error
            description = t('widgets.dataHistory.errors.forbidden');
            imgSrc = PermissionErrorImg;
            details = response.data?.error.innererror?.message;
        } else {
            imgSrc = GenericErrorImg;
            description = t('widgets.dataHistory.errors.genericBadRequest');
        }
        return { description, imgSrc, details };
    }, [requestStatus, response]);

    const theme = useTheme();
    const classNames = getDataHistoryWidgetClassNames(styles, { theme });
    const sharedCalloutStyles = getCardboardListCalloutStyles(theme);

    const errorDetailsCalloutId = useId('show-error-details-button');
    const errorDetailsCalloutDescriptionId = useId(
        'error-details-callout-description'
    );
    const errorDetailsCallout = useMemo(() => {
        if (response?.data?.error.innererror?.message) {
            return (
                isDetailsCalloutVisible && (
                    <Callout
                        ariaDescribedBy={errorDetailsCalloutDescriptionId}
                        styles={{
                            ...sharedCalloutStyles,
                            root: {
                                ...(sharedCalloutStyles.root as any),
                                fontSize: 12
                            }
                        }}
                        target={`#${errorDetailsCalloutId}`}
                        onDismiss={toggleIsDetailsCalloutVisible}
                        role="alert"
                    >
                        <Text
                            block
                            variant="small"
                            id={errorDetailsCalloutDescriptionId}
                            style={{ maxHeight: 100, overflow: 'hidden auto' }}
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
                )
            );
        } else {
            return null;
        }
    }, [response?.data?.error.innererror?.message, isDetailsCalloutVisible]);

    return (
        <div style={classNames.subComponentStyles.errorContainer().root}>
            <IllustrationMessage
                headerText=""
                descriptionText={errorObj.description}
                type={'error'}
                width={'compact'}
                imageProps={{
                    src: errorObj.imgSrc,
                    height: IMG_HEIGHT,
                    styles: classNames.subComponentStyles.errorContainer().image
                }}
                linkProps={
                    errorObj.details
                        ? {
                              id: errorDetailsCalloutId,
                              onClick: toggleIsDetailsCalloutVisible
                          }
                        : {
                              onClick: () => {
                                  window.open(DOCUMENTATION_LINKS.dataHistory);
                              }
                          }
                }
                linkText={
                    errorObj.details
                        ? isDetailsCalloutVisible
                            ? t('hideDetails')
                            : t('showDetails')
                        : t('learnMore')
                }
                styles={{
                    container: classNames.subComponentStyles.errorContainer()
                        .textContainer,
                    descriptionContainer: classNames.subComponentStyles.errorContainer()
                        .descriptionContainer
                }}
            />
            {errorDetailsCallout}
        </div>
    );
};
