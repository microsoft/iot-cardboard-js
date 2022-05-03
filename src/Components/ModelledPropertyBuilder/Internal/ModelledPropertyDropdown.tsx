import {
    Dropdown,
    DropdownMenuItemType,
    Icon,
    IDropdownOption
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { DTDLPropertyIconographyMap } from '../../../Models/Constants/Constants';
import {
    dropdownIconStyles,
    dropdownStyles,
    getStyles
} from '../ModelledPropertyBuilder.styles';
import { IFlattenedModelledPropertiesFormat } from '../ModelledPropertyBuilder.types';

interface ModelledPropertyDropdownProps {
    flattenedProperties: IFlattenedModelledPropertiesFormat;
    selectedKey: string;
    onChange: (option: IDropdownOption) => void;
    label: string;
}

const getDropdownOptions = (
    flattenedProperties: IFlattenedModelledPropertiesFormat
) => {
    let modelledPropertyOptions: Array<IDropdownOption> = [];

    for (const tag of Object.keys(flattenedProperties)) {
        const tagProperties = [
            {
                key: `${tag}-header`,
                text: tag,
                itemType: DropdownMenuItemType.Header
            },
            ...flattenedProperties[tag].map((property) => {
                const propertyIcon =
                    DTDLPropertyIconographyMap[property.propertyType];

                return {
                    key: property.fullPath,
                    text: property.localPath,
                    data: {
                        ...(propertyIcon && {
                            icon: propertyIcon.icon,
                            iconTitle: propertyIcon.text
                        }),
                        property
                    }
                };
            })
        ];

        modelledPropertyOptions = modelledPropertyOptions.concat(tagProperties);
    }

    return modelledPropertyOptions;
};

export const ModelledPropertyDropdown: React.FC<ModelledPropertyDropdownProps> = ({
    flattenedProperties,
    onChange,
    selectedKey,
    label
}) => {
    const styles = getStyles();
    const options = useMemo(() => getDropdownOptions(flattenedProperties), [
        flattenedProperties
    ]);

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
            label={label}
            options={options}
            onChange={(_event, option) => onChange(option)}
            selectedKey={selectedKey}
            placeholder="Select a property"
            onRenderOption={onRenderOption}
            onRenderTitle={onRenderTitle}
            styles={dropdownStyles}
        />
    );
};
