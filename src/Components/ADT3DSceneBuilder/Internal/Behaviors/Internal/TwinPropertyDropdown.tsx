import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import useBehaviorTwinPropertyNames from '../../../../../Models/Hooks/useBehaviorTwinPropertyNames';
import { buildDropdownOptionsFromStrings } from '../../../../../Models/Services/Utils';

const ROOT_LOC = '3dSceneBuilder.twinPropertyDropdown';
const LOC_KEYS = {
    propertyDropdownLabel: `${ROOT_LOC}.propertyDropdownLabel`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`,
    noSelectionValue: `${ROOT_LOC}.noSelectionValue`
};

interface ITwinPropertyDropdownProps {
    behavior: IBehavior;
    dataTestId?: string;
    defaultSelectedKey?: string;
    label?: string;
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
    onChange
}) => {
    const { t } = useTranslation();

    const [selectedProperty, setSelectedProperty] = useState(
        defaultSelectedKey
    );

    // get the property list
    const { options, isLoading } = useBehaviorTwinPropertyNames({
        behavior: behavior,
        emptyItemLocKey: LOC_KEYS.noSelectionValue
    });
    // convert to dropdown items
    const propertyOptions = useMemo(
        () => buildDropdownOptionsFromStrings(options),
        [options]
    );

    const onPropertyChange = useCallback(
        (_e, option: IDropdownOption) => {
            setSelectedProperty(option.data);
            onChange(option.data);
        },
        [onChange, setSelectedProperty]
    );

    const hasProperties = propertyOptions.length > 1; // ignore the default empty item
    const showError = !hasProperties && !isLoading;
    return (
        <Dropdown
            data-testid={dataTestId || 'twin-property-dropdown'}
            selectedKey={selectedProperty}
            disabled={!hasProperties}
            errorMessage={showError && t(LOC_KEYS.noElementsSelected)}
            label={label || t(LOC_KEYS.propertyDropdownLabel)}
            onChange={onPropertyChange}
            options={propertyOptions}
        />
    );
};
export default TwinPropertyDropown;
