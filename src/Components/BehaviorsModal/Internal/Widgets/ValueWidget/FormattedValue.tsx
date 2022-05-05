import React, { memo } from 'react';
import { useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { Locale } from '../../../../../Models/Constants/Enums';
import { IDTDLPropertyType } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getStyles } from './ValueWidget.styles';

interface IProps {
    locale: Locale;
    value: any;
    type: IDTDLPropertyType;
}
const FormattedValue: React.FC<IProps> = ({ locale, value, type }) => {
    const theme = useTheme();
    const typedValue = ViewerConfigUtility.getTypedDTDLPropertyValue(
        value,
        type
    ); // get the typed value in case it is not in the data format it is set

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

    const maxNumberOfCharactersBeforeTextWrap = 10;

    const styles = getStyles(theme);
    let stringValueToDisplay = '';
    switch (type) {
        case 'date': {
            stringValueToDisplay = (typedValue as Date).toLocaleDateString(
                locale,
                dateOptions
            );
            return (
                <div className={styles.expressionValueContainer}>
                    <span
                        className={styles.expressionValuePrimary}
                        title={stringValueToDisplay}
                    >
                        {stringValueToDisplay}
                    </span>
                </div>
            );
        }
        case 'duration': {
            return (
                <div className={styles.expressionValueContainer}>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['years']} years`}</span>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['months']} months`}</span>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['days']} days`}</span>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['hours']} hours`}</span>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['mins']} minutes`}</span>
                    <span
                        className={styles.expressionValueListItem}
                    >{`${typedValue['secs']} seconds`}</span>
                </div>
            );
        }
        case 'dateTime':
            return (
                <div className={styles.expressionValueContainer}>
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
                </div>
            );
        case 'time': {
            const mockTypedValue = new Date('1970-01-01T' + typedValue); // temporarly append a fake date part for the time which is not needed when rendering
            return (
                <div className={styles.expressionValueContainer}>
                    <span className={styles.expressionValueSecondary}>
                        {mockTypedValue.toLocaleTimeString(locale, timeOptions)}
                    </span>
                </div>
            );
        }
        case 'double':
        case 'float': {
            stringValueToDisplay = (typedValue as number).toLocaleString(
                locale,
                numberOptions
            );
            return (
                <div className={styles.expressionValueContainer}>
                    <span
                        className={styles.expressionValuePrimary}
                        title={(typedValue as number).toLocaleString(locale)}
                    >
                        {stringValueToDisplay}
                    </span>
                </div>
            );
        }
        default: {
            stringValueToDisplay = typedValue.toString();
            return (
                <div className={styles.expressionValueContainer}>
                    <span
                        className={`${
                            stringValueToDisplay.length >
                            maxNumberOfCharactersBeforeTextWrap
                                ? styles.expressionValueOverflowed
                                : styles.expressionValuePrimary
                        }`}
                        title={stringValueToDisplay}
                    >
                        {stringValueToDisplay}
                    </span>
                </div>
            );
        }
    }
};

export default memo(FormattedValue);
