import React, { useMemo } from 'react';
import {
    DataHistoryServiceErrorCodes,
    IDataHistoryErrorHandlingWrapperProps,
    IDataHistoryErrorHandlingWrapperStyleProps,
    IDataHistoryErrorHandlingWrapperStyles
} from './DataHistoryErrorHandlingWrapper.types';
import { getStyles } from './DataHistoryErrorHandlingWrapper.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    Text,
    Link
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { ComponentErrorType } from '../../Models/Constants/Enums';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import { DOCUMENTATION_LINKS } from '../../Models/Constants';
import ConnectionErrorImg from '../../Resources/Static/connectionError.svg';
import PermissionErrorImg from '../../Resources/Static/priviledgedAccess.svg';
import GenericErrorImg from '../../Resources/Static/noResults.svg';

const ROOT_LOC = 'dataHistoryErrorHandlingWrapper';
const LOC_KEYS = {
    genericNetwork: `${ROOT_LOC}.errors.genericNetwork`,
    genericBadRequest: `${ROOT_LOC}.errors.genericBadRequest`,
    generalBadRequestMessage: `${ROOT_LOC}.errors.generalBadRequestMessage`,
    entityNotFound: `${ROOT_LOC}.errors.entityNotFound`,
    forbidden: `${ROOT_LOC}.errors.forbidden`
};

const getClassNames = classNamesFunction<
    IDataHistoryErrorHandlingWrapperStyleProps,
    IDataHistoryErrorHandlingWrapperStyles
>();

/** This component surfaces some of the error messages based on:
 * 1- ADX connection information (cluster URL, database name, table name) in the data history widget configuration
 * 2- query string in the data history widget configuration
 * 3- permission to query
 * See a full list of errors returned by ADX service requests here:
 * https://learn.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/kusto-data-client-errors and
 * https://learn.microsoft.com/en-us/azure/data-explorer/error-codes
 */
const DataHistoryErrorHandlingWrapper: React.FC<IDataHistoryErrorHandlingWrapperProps> = (
    props
) => {
    const { error, imgHeight, messageWidth = 'compact', styles } = props;

    // hooks
    const { t } = useTranslation();
    const [
        isDetailsCalloutVisible,
        { toggle: toggleIsDetailsCalloutVisible }
    ] = useBoolean(false);
    const errorDetailsCalloutId = useId('show-error-details-button');
    const errorDetailsCalloutDescriptionId = useId(
        'error-details-callout-description'
    );

    const errorObj: {
        description: string;
        imgSrc: string;
        details: string;
    } = useMemo(() => {
        let description = '';
        let imgSrc = '';
        let details = '';

        const errorType = error.type;
        const errorResponse = (error.rawError as any)?.response;

        switch (errorType) {
            case ComponentErrorType.ConnectionError: // status 0
                // e.g. with network error of ERR_NAME_NOT_RESOLVED due to invalid request url (including cluster url error) or connection error
                description = t(LOC_KEYS.genericNetwork);
                imgSrc = ConnectionErrorImg;
                break;
            case ComponentErrorType.BadRequestException: // status 400
                switch (errorResponse?.data.error.code) {
                    case DataHistoryServiceErrorCodes.General_BadRequest: // query error (including table name since it is part of query in the request payload)
                        description = t(LOC_KEYS.generalBadRequestMessage);
                        imgSrc = GenericErrorImg;
                        break;
                    case DataHistoryServiceErrorCodes.BadRequest_EntityNotFound: // database error
                        description = t(LOC_KEYS.entityNotFound);
                        imgSrc = ConnectionErrorImg;
                        break;
                    default:
                        description = t(LOC_KEYS.genericBadRequest);
                        imgSrc = GenericErrorImg;
                        break;
                }
                details = errorResponse?.data.error.innererror?.message;
                break;
            case ComponentErrorType.UnauthorizedAccess: // status 403
                // permission error
                description = t(LOC_KEYS.forbidden);
                imgSrc = PermissionErrorImg;
                details = errorResponse?.data.error.innererror?.message;
                break;
            case ComponentErrorType.TimeSeriesDatabaseConnectionFetchFailed: // specific adapter error
                description = t(
                    'errors.timeSeriesDatabaseConnectionFetchFailed.message',
                    { permission: 'Reader' }
                );
                imgSrc = ConnectionErrorImg;
                break;
            default:
                description = t(LOC_KEYS.genericBadRequest);
                imgSrc = GenericErrorImg;
                details = errorResponse?.data?.error?.innererror?.message;
                break;
        }
        return { description, imgSrc, details };
    }, [error]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const errorDetailsCallout = useMemo(() => {
        if (errorObj.details) {
            return (
                isDetailsCalloutVisible && (
                    <Callout
                        ariaDescribedBy={errorDetailsCalloutDescriptionId}
                        styles={classNames.subComponentStyles.calloutStyles}
                        target={`#${errorDetailsCalloutId}`}
                        onDismiss={toggleIsDetailsCalloutVisible}
                        role="alert"
                    >
                        <Text
                            block
                            variant="small"
                            id={errorDetailsCalloutDescriptionId}
                            styles={classNames.subComponentStyles.calloutText}
                        >
                            {errorObj.details}
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
    }, [errorObj.details, isDetailsCalloutVisible, classNames]);

    return (
        <div className={classNames.root}>
            <IllustrationMessage
                descriptionText={errorObj.description}
                type={'info'}
                width={messageWidth}
                imageProps={{
                    src: errorObj.imgSrc,
                    styles: classNames.subComponentStyles.image,
                    height: imgHeight
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
                styles={classNames.subComponentStyles.illustrationMessage}
            />
            {errorDetailsCallout}
        </div>
    );
};

export default styled<
    IDataHistoryErrorHandlingWrapperProps,
    IDataHistoryErrorHandlingWrapperStyleProps,
    IDataHistoryErrorHandlingWrapperStyles
>(DataHistoryErrorHandlingWrapper, getStyles);
