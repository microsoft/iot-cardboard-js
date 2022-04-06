import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Icon, IDropdownOption, IIconStyles } from '@fluentui/react';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import useBehaviorTwinPropertyNames from '../../../../../Models/Hooks/useBehaviorTwinPropertyNames';
import { buildDropdownOptionsFromStrings } from '../../../../../Models/Services/Utils';

const iconStyles: IIconStyles = {
    root: { bottom: -1, marginLeft: 8, position: 'relative' }
};

const ROOT_LOC = '3dSceneBuilder.twinPropertyDropdown';
const LOC_KEYS = {
    propertyDropdownLabel: `${ROOT_LOC}.propertyDropdownLabel`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`,
    noSelectionValue: `${ROOT_LOC}.noSelectionValue`,
    propertyNotFound: `${ROOT_LOC}.propertyNotFound`
};

interface ITwinPropertyDropdownProps {
    behavior: IBehavior;
    dataTestId?: string;
    defaultSelectedKey?: string;
    label?: string;
    required?: boolean;
    onChange: (value: string) => void;
}
/**
 * This component fetches the ACTIVE properties for the twins that are connected to the behavior
 * It renders those in a dropdown and when the selection changes it reports that back
 *
 * Note: it does not fetch the properties that are on the model but not actively reporting values
 */
const TwinPropertyDropown: React.FC<ITwinPropertyDropdownProps> = ({
    behavior,
    dataTestId,
    defaultSelectedKey,
    label,
    required,
    onChange
}) => {
    const { t } = useTranslation();

    // get the property list
    const { options, isLoading } = useBehaviorTwinPropertyNames({
        behavior: behavior,
        isFullName: true,
        isTwinAliasesIncluded: true
    });

    const [selectedProperty, setSelectedProperty] = useState(
        defaultSelectedKey
    );
    // convert to dropdown items
    const propertyOptions = useMemo(() => {
        let addedCustom = false;
        // if the selected option isn't in the list, then add it so that we don't show nothing
        // NOTE: this is a bit controversial so talk to Matt & Mitch for context. :)
        if (
            defaultSelectedKey &&
            !options.find((x) => x === defaultSelectedKey)
        ) {
            options.push(defaultSelectedKey);
            options.sort();
            addedCustom = true;
        }
        const dropdownOptions = buildDropdownOptionsFromStrings(
            options as string[]
        );
        if (addedCustom) {
            // add the icon to the item so they know it's not in the data set
            dropdownOptions.find((x) => x.key === defaultSelectedKey).data = {
                icon: 'Warning'
            };
        }
        // add an empty entry to the start of the list
        dropdownOptions.unshift({
            key: '',
            text: t(LOC_KEYS.noSelectionValue)
        });
        return dropdownOptions;
    }, [options]);

    const onPropertyChange = useCallback(
        (_e, option: IDropdownOption) => {
            setSelectedProperty(option.key as string);
            onChange(option.key as string);
        },
        [onChange, setSelectedProperty]
    );
    const onRenderOption = useCallback(
        (option: IDropdownOption): JSX.Element => {
            return (
                <>
                    <span>{option.text}</span>
                    {/* TODO: Add an aria tag here so screenreader picks up the same context as the tooltip */}
                    {option?.data?.icon && (
                        <Icon
                            styles={iconStyles}
                            iconName={option.data.icon}
                            aria-hidden="true"
                            title={t(LOC_KEYS.propertyNotFound)}
                        />
                    )}
                </>
            );
        },
        []
    );

    const hasProperties = propertyOptions.length > 1; // ignore the default empty item
    const disabled = !hasProperties || isLoading;
    const showError = !hasProperties && !isLoading;
    return (
        <Dropdown
            data-testid={dataTestId || 'twin-property-dropdown'}
            selectedKey={selectedProperty}
            disabled={disabled}
            errorMessage={showError && t(LOC_KEYS.noElementsSelected)}
            label={label || t(LOC_KEYS.propertyDropdownLabel)}
            onChange={onPropertyChange}
            onRenderOption={onRenderOption}
            options={propertyOptions}
            required={required}
        />
    );
};

export default TwinPropertyDropown;
