import { Icon, IDropdownOption } from '@fluentui/react';
import React from 'react';

const iconStyles = { marginRight: '8px' };
const optionWrapperStyle = { display: 'flex', alignItems: 'center' };

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

export const onRenderTypeTitle = (options: IDropdownOption[]): JSX.Element => {
    const option = options[0];

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
