import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IValueRange } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ValueRangeBuilderContext } from '../ValueRangeBuilder';

const ValueRangeValidationError: React.FC<{
    valueRange: IValueRange;
}> = ({ valueRange }) => {
    const { state } = useContext(ValueRangeBuilderContext);
    const { t } = useTranslation();

    const validationData = state.validationMap.validation[valueRange.id];

    const getValidationMessaging = () => {
        if (!validationData.maxValid || !validationData.minValid) {
            return t('valueRangeBuilder.rangeValueInvalidMessage');
        } else if (!validationData.rangeValid) {
            return t('valueRangeBuilder.rangeInvalidMessage');
        } else {
            return null;
        }
    };

    const message = getValidationMessaging();

    if (!message) return null;

    return <div className="cb-value-range-validation-error">{message}</div>;
};

export default ValueRangeValidationError;
