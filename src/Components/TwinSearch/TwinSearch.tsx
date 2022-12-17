import React, { useCallback, useRef } from 'react';
import {
    ITwinSearchProps,
    ITwinSearchStyleProps,
    ITwinSearchStyles
} from './TwinSearch.types';
import { getStyles } from './TwinSearch.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    IconButton
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import TwinPropertySearchDropdown from '../TwinPropertySearchDropdown/TwinPropertySearchDropdown';
import PropertyInspectorCallout from '../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout';
import { useTranslation } from 'react-i18next';
import { DTID_PROPERTY_NAME } from '../../Models/Constants/Constants';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import { queryAllowedPropertyValueTypes } from '../AdvancedSearch/Internal/QueryBuilder/QueryBuilder.types';
import { PropertyValueHandle } from '../TwinPropertySearchDropdown/TwinPropertySearchDropdown.types';

const getClassNames = classNamesFunction<
    ITwinSearchStyleProps,
    ITwinSearchStyles
>();

const TwinSearch: React.FC<ITwinSearchProps> = (props) => {
    const {
        adapter,
        disableDropdownDescription,
        dropdownDescription,
        dropdownLabel,
        dropdownLabelIconName,
        onSelectTwinId,
        initialSelectedValue,
        isInspectorDisabled,
        twinId,
        styles
    } = props;

    // Refs
    const propertyDropdownRef = useRef<PropertyValueHandle>(null);

    // contexts

    // state
    const [
        isAdvancedSearchOpen,
        { toggle: toggleAdvancedSearchOpen }
    ] = useBoolean(false);

    // hooks
    const { t } = useTranslation();

    // callbacks
    const handleSearchSelectTwinId = useCallback(
        (selectedTwinId: string) => {
            if (propertyDropdownRef.current && selectedTwinId.length) {
                propertyDropdownRef.current.setValue(selectedTwinId);
                onSelectTwinId(selectedTwinId);
            }
        },
        [onSelectTwinId]
    );

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <>
            <Stack horizontal={true} tokens={{ childrenGap: 4 }}>
                <TwinPropertySearchDropdown
                    ref={propertyDropdownRef}
                    adapter={adapter}
                    descriptionText={
                        disableDropdownDescription
                            ? undefined
                            : dropdownDescription ||
                              t(
                                  '3dSceneBuilder.elementForm.twinNameDescription'
                              )
                    }
                    label={dropdownLabel || t('3dSceneBuilder.primaryTwin')}
                    labelIconName={dropdownLabelIconName}
                    labelTooltip={{
                        buttonAriaLabel: t(
                            '3dSceneBuilder.elementForm.twinNameTooltip'
                        ),
                        calloutContent: t(
                            '3dSceneBuilder.elementForm.twinNameTooltip'
                        )
                    }}
                    initialSelectedValue={initialSelectedValue}
                    searchPropertyName={DTID_PROPERTY_NAME}
                    onChange={onSelectTwinId}
                    styles={
                        classNames.subComponentStyles.twinPropertySearchDropdown
                    }
                />
                <PropertyInspectorCallout
                    adapter={adapter}
                    twinId={twinId}
                    disabled={isInspectorDisabled}
                    styles={classNames.subComponentStyles.propertyInspector}
                />
                <IconButton
                    iconProps={{
                        iconName: 'QueryList'
                    }}
                    onClick={toggleAdvancedSearchOpen}
                    styles={classNames.subComponentStyles.advancedSearchButton()}
                    title={t('advancedSearch.modalTitle')}
                />
            </Stack>
            {/* Modal */}
            {isAdvancedSearchOpen && (
                <AdvancedSearch
                    adapter={adapter}
                    allowedPropertyValueTypes={queryAllowedPropertyValueTypes}
                    isOpen={isAdvancedSearchOpen}
                    onDismiss={toggleAdvancedSearchOpen}
                    onTwinIdSelect={handleSearchSelectTwinId}
                />
            )}
        </>
    );
};

export default styled<
    ITwinSearchProps,
    ITwinSearchStyleProps,
    ITwinSearchStyles
>(TwinSearch, getStyles);
