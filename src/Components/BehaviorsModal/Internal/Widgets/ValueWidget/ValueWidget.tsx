import { useTheme } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Locale } from '../../../../../Models/Constants/Enums';
import { parseExpression } from '../../../../../Models/Services/Utils';
import {
    IDTDLPropertyType,
    IValueWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import FormattedValue from './FormattedValue';
import { getStyles } from './ValueWidget.styles';

const ValuePlaceholders = {
    boolean: 'true',
    date: 'Jan 10, 2022', // A full-date as defined in section 5.6 of RFC 3339
    dateTime: '2019-10-12T07:20:50.52Z', // A date-time as defined in 5.6 of RFC 3339
    double: '123.4',
    duration: 'P3Y6M4DT12H30M5S', // A duration in ISO 8601 format
    enum: 'Active',
    float: '123.45',
    integer: '123',
    long: '123456789000000000000',
    string:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    time: '07:20:50.52Z' // A full-time as defined in section 5.6 of RFC 3339
};
interface IProp {
    widget: IValueWidget;
    placeholderValues?: Record<IDTDLPropertyType, any>;
}

export const ValueWidget: React.FC<IProp> = ({ widget, placeholderValues }) => {
    const theme = useTheme();
    const { i18n } = useTranslation();

    const { twins } = useContext(BehaviorsModalContext);
    const { displayName, valueExpression, type } = widget.widgetConfiguration;

    const parsedValue = useMemo(
        () => parseExpression(valueExpression, twins),

        [valueExpression, twins]
    );

    const styles = getStyles(theme);
    return (
        <div className={styles.container}>
            <FormattedValue
                locale={i18n.language as Locale}
                value={
                    parsedValue ||
                    (placeholderValues?.[type] ?? ValuePlaceholders[type])
                }
                type={type}
            />
            <span className={styles.displayName} title={displayName}>
                {displayName}
            </span>
        </div>
    );
};
