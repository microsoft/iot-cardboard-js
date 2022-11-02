import { IStyleFunctionOrObject, useTheme } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IComponentError } from '../../../../../../Models/Constants/Interfaces';
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
    const { t } = useTranslation();
    const classNames = getDataHistoryWidgetClassNames(styles, {
        theme: useTheme()
    });
    const requestStatus = (errors[0].rawError as any).request.status;
    const response = (errors[0].rawError as any).response;

    return (
        <div className={classNames.errorContainer}>
            <span>
                {requestStatus === 0 // e.g. with network error of ERR_NAME_NOT_RESOLVED due to invalid request url or connection error
                    ? t('widgets.dataHistory.errors.genericNetwork')
                    : requestStatus === 400
                    ? response.data?.error.code ===
                      ConnectionErrors.General_BadRequest
                        ? t(
                              'widgets.dataHistory.errors.generalBadRequestMessage'
                          )
                        : t('widgets.dataHistory.errors.genericBadRequest')
                    : errors[0].message}
            </span>
        </div>
    );
};
