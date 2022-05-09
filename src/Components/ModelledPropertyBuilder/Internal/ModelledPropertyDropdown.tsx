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
    dropdownOptions: IDropdownOption<any>[];
    dropdownTestId: string;
}

export const ModelledPropertyDropdown: React.FC<ModelledPropertyDropdownProps> = ({
    onChange,
    selectedKey,
    dropdownOptions,
    dropdownTestId
}) => {
    const { t } = useTranslation();
    const styles = getStyles();

    const isNoneOptionPresent = dropdownOptions.find(
        (option) => option.key === 'none'
    );

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
                    {option.key === 'none'
                        ? t('3dSceneBuilder.ModelledPropertyBuilder.none')
                        : option.key}
                </div>
            </>
        );
    };

    return (
        <Dropdown
            options={dropdownOptions}
            onChange={(_event, option) => {
                onChange(option);
            }}
            selectedKey={
                selectedKey === '' && isNoneOptionPresent ? 'none' : selectedKey
            }
            placeholder={t(
                '3dSceneBuilder.ModelledPropertyBuilder.dropdownPlaceholder'
            )}
            data-testid={dropdownTestId}
            onRenderOption={onRenderOption}
            onRenderTitle={onRenderTitle}
            styles={dropdownStyles}
        />
    );
};
