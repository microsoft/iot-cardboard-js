import { Icon, IDropdownOption } from '@fluentui/react';
import React from 'react';

const iconStyles = { marginRight: '8px' };
const optionWrapperStyle = { display: 'flex', alignItems: 'center' };

/** Helper function used to render property dropdown items with icons and text */
export const onRenderTypeOption = (option: IDropdownOption): JSX.Element => {
    return (
        <div style={optionWrapperStyle}>
            {option.data && option.data.icon && (
                <Icon
                    style={iconStyles}
                    iconName={option.data.icon}
                    aria-hidden="true"
                    title={option.data.icon}
                />
            )}
            <span>{option.text}</span>
        </div>
    );
};

/** Helper function used to render property dropdown titles with icons and text */
export const onRenderTypeTitle = (options: IDropdownOption[]): JSX.Element => {
    const option = options[0];
    return onRenderTypeOption(option);
};

/** Check validity for a certain form */

export interface IValidityState {
    isValid: boolean;
}
// This is used to set initial state of a validity map
export type FieldToValidate = {
    key: string;
    defaultValidityState: boolean;
};

export const checkValidityMap = (
    validityMap: Map<string, IValidityState>
): boolean => {
    let isValid = true;
    validityMap.forEach((x) => {
        isValid = isValid && x.isValid;
    });
    return isValid;
};

export const createValidityMap = (
    fieldsToValidate: FieldToValidate[]
): Map<string, IValidityState> => {
    const validityMap = new Map<string, IValidityState>();
    fieldsToValidate.forEach((field) => {
        validityMap.set(field.key, { isValid: field.defaultValidityState });
    });
    return validityMap;
};
