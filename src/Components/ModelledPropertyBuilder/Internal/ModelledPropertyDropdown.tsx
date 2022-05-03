import { Dropdown, Icon, IDropdownOption } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    dropdownIconStyles,
    dropdownStyles,
    getStyles
} from '../ModelledPropertyBuilder.styles';

interface ModelledPropertyDropdownProps {
    selectedKey: string;
    onChange: (option: IDropdownOption) => void;
    label: string;
    dropdownOptions: IDropdownOption<any>[];
    required: boolean;
}

export const ModelledPropertyDropdown: React.FC<ModelledPropertyDropdownProps> = ({
    onChange,
    selectedKey,
    label,
    dropdownOptions,
    required
}) => {
    const { t } = useTranslation();
    const styles = getStyles();

    const onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <>
                {option.data && option.data.icon && (
                    <Icon
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.iconTitle}
                        styles={dropdownIconStyles}
                    />
                )}
                <span
                    className={styles.dropdownTitleText}
                    title={option.data?.property?.fullPath}
                >
                    {option.text}
                </span>
            </>
        );
    };

    const onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return (
            <>
                {option.data && option.data.icon && (
                    <Icon
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.iconTitle}
                        styles={dropdownIconStyles}
                    />
                )}
                <div
                    className={styles.dropdownTitleText}
                    title={option.data?.property?.fullPath}
                >
                    {option.key}
                </div>
            </>
        );
    };

    return (
        <Dropdown
            required={required}
            label={label}
            options={dropdownOptions}
            onChange={(_event, option) => onChange(option)}
            selectedKey={selectedKey}
            placeholder={t(
                '3dSceneBuilder.ModelledPropertyBuilder.dropdownPlaceholder'
            )}
            onRenderOption={onRenderOption}
            onRenderTitle={onRenderTitle}
            styles={dropdownStyles}
        />
    );
};
