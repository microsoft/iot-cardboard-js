import {
    Dropdown,
    DropdownMenuItemType,
    Icon,
    IDropdownOption
} from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { IFlattenedModelledPropertiesFormat } from '../ModelledPropertyBuilder.types';

interface ModelledPropertyDropdownProps {
    flattenedProperties: IFlattenedModelledPropertiesFormat;
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
            ...flattenedProperties[tag].map((property) => ({
                key: property.fullPath,
                text: property.localPath
            }))
        ];

        modelledPropertyOptions = modelledPropertyOptions.concat(tagProperties);
    }

    return modelledPropertyOptions;
};

export const ModelledPropertyDropdown: React.FC<ModelledPropertyDropdownProps> = ({
    flattenedProperties
}) => {
    const [selectedProperty, setSelectedProperty] = useState<IDropdownOption>();

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        setSelectedProperty(item);
    };

    const options = useMemo(() => getDropdownOptions(flattenedProperties), [
        flattenedProperties
    ]);

    const onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <div>
                {option.data && option.data.icon && (
                    <Icon
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.icon}
                    />
                )}
                <span>{option.text}</span>
            </div>
        );
    };

    const onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return (
            <div>
                {option.data && option.data.icon && (
                    <Icon
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.icon}
                    />
                )}
                <span>{option.text}</span>
            </div>
        );
    };

    return (
        <Dropdown
            options={options}
            onChange={onChange}
            selectedKey={selectedProperty ? selectedProperty.key : undefined}
            placeholder="Select a property"
            onRenderOption={onRenderOption}
            onRenderTitle={onRenderTitle}
        />
    );
};
