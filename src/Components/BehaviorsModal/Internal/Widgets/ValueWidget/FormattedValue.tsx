import React, { memo } from 'react';
import { useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { Locale } from '../../../../../Models/Constants/Enums';
import { IDTDLPropertyType } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getStyles } from './ValueWidget.styles';
import { useTranslation } from 'react-i18next';

interface IProps {
    locale: Locale;
    value: boolean | Date | number | string;
    type: IDTDLPropertyType;
}

const invalidPlaceholder = '--';

const FormattedValue: React.FC<IProps> = ({ locale, value, type }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const styles = getStyles(theme);

    // Show '--' if value is null (unset on twin)
    if (value === null || value === undefined) {
        return (
            <span
                className={styles.expressionValueInvalidPlaceholder}
                title={t('invalidValue')}
            >
                {invalidPlaceholder}
            </span>
        );
    }

    let stringValueToDisplay = '';
    const typedValue = ViewerConfigUtility.getTypedDTDLPropertyValue(
        value,
        type
    ); // get the typed value in case it is not in the data format it is set

    if (typedValue instanceof Error) {
        return (
            <code className={styles.invalidExpressionValue}>
                {t('invalidValue')}
            </code>
        );
    }
    switch (type) {
        case 'boolean': {
            stringValueToDisplay = typedValue.toString();
            return (
                <span
                    className={styles.expressionValuePrimary}
                    title={stringValueToDisplay}
                >
                    {stringValueToDisplay}
                </span>
            );
        }
        case 'date': {
            stringValueToDisplay = (typedValue as Date).toLocaleDateString(
                locale,
                dateOptions
            );
            return (
                <span
                    className={styles.expressionValuePrimary}
                    title={stringValueToDisplay}
                >
                    {stringValueToDisplay}
                </span>
            );
        }
        case 'duration': {
            const years = (typedValue?.['years'] as number) ?? 0;
            const months = (typedValue?.['months'] as number) ?? 0;
            const days = (typedValue?.['days'] as number) ?? 0;
            const hours = (typedValue?.['hours'] as number) ?? 0;
            const minutes = (typedValue?.['minutes'] as number) ?? 0;
            const seconds = (typedValue?.['seconds'] as number) ?? 0;

            return (
                <>
                    {years > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${years} years`}</span>
                    )}
                    {months > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${months} months`}</span>
                    )}
                    {days > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${days} days`}</span>
                    )}
                    {hours > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${hours} hours`}</span>
                    )}
                    {minutes > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${minutes} minutes`}</span>
                    )}
                    {seconds > 0 && (
                        <span
                            className={styles.expressionValueListItem}
                        >{`${seconds} seconds`}</span>
                    )}
                </>
            );
        }
        case 'dateTime':
            return (
                <>
                    <span className={styles.expressionValuePrimary}>
                        {(typedValue as Date).toLocaleDateString(
                            locale,
                            dateOptions
                        )}
                    </span>
                    <span className={styles.expressionValueSecondary}>
                        {(typedValue as Date).toLocaleTimeString(
                            locale,
                            timeOptions
                        )}
                    </span>
                </>
            );
        case 'time': {
            const mockTypedValue = new Date('1970-01-01T' + typedValue); // temporarly append a fake date part for the time which is not needed when rendering
            return (
                <span className={styles.expressionValueSecondary}>
                    {mockTypedValue.toLocaleTimeString(locale, timeOptions)}
                </span>
            );
        }
        case 'integer':
        case 'long':
        case 'double':
        case 'float': {
            stringValueToDisplay = (typedValue as number).toLocaleString(
                locale,
                numberOptions
            );
            return (
                <span
                    className={styles.expressionValuePrimary}
                    title={(typedValue as number).toLocaleString(locale)}
                >
                    {stringValueToDisplay}
                </span>
            );
        }
        default: {
            stringValueToDisplay = typedValue.toString();
            return (
                <span
                    className={styles.expressionValueOverflowed}
                    title={stringValueToDisplay}
                >
                    {stringValueToDisplay}
                </span>
            );
        }
    }
};

const dateOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'numeric', // not force 2 digits in case it is less than 10, i.e 01 -> 1
    day: 'numeric' // not force 2 digits in case it is less than 10, i.e 01 -> 1
};

const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
};

const numberOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
};

export default memo(FormattedValue);
