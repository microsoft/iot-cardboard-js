import { useTheme } from '@fluentui/react';
import { memoizeFunction } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
    BehaviorModalMode,
    Locale
} from '../../../../../Models/Constants/Enums';
import { parseLinkedTwinExpression } from '../../../../../Models/Services/Utils';
import {
    IDTDLPropertyType,
    IValueWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import FormattedValue from './FormattedValue';
import { getStyles } from './ValueWidget.styles';

const getValuePlaceholders = memoizeFunction((t: TFunction) => ({
    boolean: 'true',
    date: 'Jan 1, 1970', // A full-date as defined in section 5.6 of RFC 3339
    dateTime: '1970-01-01T00:00:00.000Z', // A date-time as defined in 5.6 of RFC 3339
    double: '123.4',
    duration: 'P3Y6M4DT12H30M5S', // A duration in ISO 8601 format
    enum: t('active'),
    float: '123.45',
    integer: '123',
    long: '123456789000000000000',
    string: 'Lorem ipsum',
    time: '07:20:50.52Z' // A full-time as defined in section 5.6 of RFC 3339
}));
interface IProp {
    widget: IValueWidget;
    placeholderValues?: Record<IDTDLPropertyType, any>;
}

export const ValueWidget: React.FC<IProp> = ({ widget, placeholderValues }) => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const { twins, mode } = useContext(BehaviorsModalContext);
    const { displayName, valueExpression, type } = widget.widgetConfiguration;

    const parsedValue = useMemo(() => {
        const parsedValue = parseLinkedTwinExpression(valueExpression, twins);
        if (parsedValue === '') {
            if (mode === BehaviorModalMode.viewer) {
                return null;
            } else {
                return (
                    placeholderValues?.[type] ?? getValuePlaceholders(t)[type]
                );
            }
        } else {
            return parsedValue;
        }
    }, [valueExpression, twins, mode, placeholderValues, type, t]);

    const styles = getStyles(theme);
    return (
        <div className={styles.container}>
            <div className={styles.expressionValueContainer}>
                <FormattedValue
                    locale={i18n.language as Locale}
                    value={parsedValue}
                    type={type}
                />
            </div>
            <span className={styles.displayName} title={displayName}>
                {displayName}
            </span>
        </div>
    );
};
