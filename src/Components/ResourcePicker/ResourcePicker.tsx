import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    IResourceOption,
    IResourcePickerOption,
    IResourcePickerProps,
    IResourcePickerStyleProps,
    IResourcePickerStyles,
    isResourceOption
} from './ResourcePicker.types';
import { getStyles } from './ResourcePicker.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    MessageBarType,
    MessageBar,
    Stack,
    Label,
    Text,
    IconButton
} from '@fluentui/react';
import { FixedSizeList } from 'react-window';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureResource,
    IComponentError,
    ValidAdtHostSuffixes,
    ValidContainerHostSuffixes
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import {
    areResourceValuesEqual,
    deepCopy,
    getMarkedHtmlBySearch,
    getResourceUrl,
    getUrlFromString
} from '../../Models/Services/Utils';
import CreatableSelect from 'react-select/creatable';
import { getReactSelectStyles } from '../../Resources/Styles/ReactSelect.styles';
import { ActionMeta, components, InputActionMeta } from 'react-select';

const freeformOptionsHeaderText = '---';
const freeformOptionsHeader: IResourcePickerOption = {
    label: freeformOptionsHeaderText,
    type: 'header'
};
const getClassNames = classNamesFunction<
    IResourcePickerStyleProps,
    IResourcePickerStyles
>();

const ResourcePicker: React.FC<IResourcePickerProps> = ({
    adapter,
    resourceType,
    requiredAccessRoles,
    shouldFetchResourcesOnMount = true,
    displayField = AzureResourceDisplayFields.id,
    styles,
    label,
    loadingLabel,
    searchParams,
    onLoaded,
    onChange,
    additionalOptions: additionalOptionsProp,
    selectedOption: selectedOptionProp,
    disabled = false,
    error: errorProp
}) => {
    const { t } = useTranslation();

    const defaultSelectedOption: IResourceOption = selectedOptionProp
        ? {
              label: selectedOptionProp,
              value: selectedOptionProp,
              type: 'option'
          }
        : null;
    const [
        selectedOption,
        setSelectedOption
    ] = useState<IResourceOption | null>(defaultSelectedOption);
    const [additionalOptions, setAdditionalOptions] = useState<
        Array<IResourceOption>
    >([]);
    const [searchValue, setSearchValue] = useState(selectedOptionProp ?? '');
    const [error, setError] = useState<IComponentError | null>(null);
    const resourcesRef = useRef<Array<IAzureResource>>([]);

    const resourcesState = useAdapter({
        adapterMethod: () =>
            adapter.getResourcesByPermissions({
                getResourcesParams: {
                    resourceType,
                    searchParams
                },
                requiredAccessRoles
            }),
        refetchDependencies: [adapter, searchParams],
        isAdapterCalledOnMount: !disabled && shouldFetchResourcesOnMount
    });

    const loadingLabelText = useMemo(() => {
        switch (
            resourceType.toLowerCase() // need to compare lowercase since for the resource types that we use Resource Graph api, it returns lowercased resource type in the response object
        ) {
            case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                return t('resourcesPicker.loadingAdtInstances');
            case AzureResourceTypes.StorageAccount.toLowerCase():
                return t('resourcesPicker.loadingStorageAccounts');
            case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                return t('resourcesPicker.loadingContainers');
            default:
                return t('resourcesPicker.loadingResources');
        }
    }, [resourceType, t]);

    const getDisplayFieldValue = useCallback(
        (resource: IAzureResource) => {
            if (displayField === AzureResourceDisplayFields.url) {
                return getResourceUrl(resource, resourceType);
            } else {
                return resource[AzureResourceDisplayFields[displayField]];
            }
        },
        [displayField, resourceType]
    );

    const sortResources = (r1: IAzureResource, r2: IAzureResource) => {
        // first sort by subscription  name then by displayFieldValue within the same subscription
        return r1.subscriptionName?.toLowerCase() >
            r2.subscriptionName?.toLowerCase()
            ? 1
            : r1.subscriptionName?.toLowerCase() <
              r2.subscriptionName?.toLowerCase()
            ? -1
            : getDisplayFieldValue(r1)?.toLowerCase() >
              getDisplayFieldValue(r2)?.toLowerCase()
            ? 1
            : -1;
    };

    const optionsFromResources = useMemo(() => {
        const resources: IAzureResource[] = resourcesRef.current;
        if (!resources) return [];
        const filteredAndSortedResources = resources
            .filter(getDisplayFieldValue) // get only resources which have valid display field property
            .sort(sortResources);

        // after fetching resources, first start creating dropdown options with resources which have display values
        const newOptions: Array<IResourcePickerOption> = [];
        let lastHeader: string;
        filteredAndSortedResources.forEach((r) => {
            if (r.subscriptionName && lastHeader !== r.subscriptionName) {
                newOptions.push({
                    label: r.subscriptionName,
                    type: 'header'
                });
                newOptions.push({
                    label: getDisplayFieldValue(r),
                    value: r,
                    type: 'option'
                });
                lastHeader = r.subscriptionName;
            } else {
                newOptions.push({
                    label:
                        getDisplayFieldValue(r) ||
                        t('resourcesPicker.displayFieldNotFound', {
                            displayField:
                                AzureResourceDisplayFields[displayField],
                            id: r.id
                        }),
                    value: r,
                    type: 'option'
                });
            }
        });
        return newOptions;
    }, [getDisplayFieldValue, displayField, t, resourcesRef.current]);

    const options: Array<IResourcePickerOption> = useMemo(() => {
        let mergedOptions: Array<IResourcePickerOption> = [];

        // Step-1: Construct the options from fetched resources - if exists
        mergedOptions = mergedOptions.concat(optionsFromResources);

        // Step-2: Append additonal options to the options if not already there
        if (additionalOptions) {
            const resourcesOptions = optionsFromResources.filter(
                isResourceOption
            );
            const optionsToAdd = additionalOptions.filter(
                (additionalOption) =>
                    resourcesOptions.findIndex((option) =>
                        areResourceValuesEqual(
                            option.label,
                            additionalOption.label,
                            displayField
                        )
                    ) === -1
            );
            if (optionsToAdd.length) {
                if (resourcesRef.current?.length > 0) {
                    // add the freeform options header if the resources are fetched and exists
                    mergedOptions.push(freeformOptionsHeader);
                }
                mergedOptions = mergedOptions.concat(optionsToAdd);
            }
        }

        // Step-3: Append selected option to the options if not already there
        if (selectedOption) {
            const selectedOptionInMergedOptions = mergedOptions.find(
                (mergedOption) =>
                    areResourceValuesEqual(
                        mergedOption.label,
                        selectedOption.label,
                        displayField
                    )
            );
            if (!selectedOptionInMergedOptions) {
                if (resourcesRef.current?.length > 0) {
                    const freeFromOptionsHeaderExist = mergedOptions?.find(
                        (option) =>
                            !isResourceOption(option) &&
                            option.label === freeformOptionsHeaderText
                    );
                    if (!freeFromOptionsHeaderExist) {
                        mergedOptions.push(freeformOptionsHeader);
                    }
                }
                mergedOptions = mergedOptions.concat(selectedOption);
            }
        }
        return mergedOptions;
    }, [
        displayField,
        getDisplayFieldValue,
        optionsFromResources,
        additionalOptions,
        selectedOption,
        resourcesRef.current
    ]);

    const placeholder = () => {
        switch (resourceType.toLowerCase()) {
            case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                return t('resourcesPicker.adtInstancePlaceholder');
            case AzureResourceTypes.StorageAccount.toLowerCase():
                return t('resourcesPicker.storageAccountPlaceholder');
            case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                return t('resourcesPicker.storageContainerPlaceholder');
            default:
                return 'resourcesPicker.selectResourcePlaceholder';
        }
    };

    const getResourcesFromOptions = (
        options: Array<IResourcePickerOption>
    ): Array<IAzureResource | string> => {
        return options
            ?.filter(isResourceOption)
            .map((option: IResourceOption) => option.value);
    };

    useEffect(() => {
        if (resourcesState.adapterResult.getCatastrophicError()) {
            resourcesRef.current = null;
            setError(resourcesState.adapterResult.getCatastrophicError());
        } else if (!resourcesState.adapterResult.hasNoData()) {
            const resources: Array<IAzureResource> =
                resourcesState.adapterResult.result?.data;
            resourcesRef.current = resources;

            if (onLoaded) {
                onLoaded(resources);
            }
        } else {
            resourcesRef.current = [];
        }
    }, [resourcesState.adapterResult, onLoaded]);

    useEffect(() => {
        if (selectedOptionProp) {
            const existingOption = options
                .filter(isResourceOption)
                .find((o) =>
                    areResourceValuesEqual(
                        o.label,
                        selectedOptionProp,
                        displayField
                    )
                ) as IResourceOption;
            if (existingOption) {
                setSelectedOption(existingOption);
            } else {
                setSelectedOption({
                    label: selectedOptionProp,
                    value: selectedOptionProp,
                    type: 'option'
                });
            }
            setSearchValue(selectedOptionProp);
        } else {
            setSearchValue('');
            setSelectedOption(null);
        }
    }, [selectedOptionProp]);

    useEffect(() => {
        const additionalOptionsToAdd =
            additionalOptionsProp?.filter(
                (additionalOptionProp) =>
                    additionalOptionProp &&
                    options.findIndex((additionalOption) =>
                        areResourceValuesEqual(
                            additionalOption.label,
                            additionalOptionProp,
                            displayField
                        )
                    ) === -1
            ) || [];
        setAdditionalOptions(
            additionalOptions.concat(
                additionalOptionsToAdd.map(
                    (aO) =>
                        ({
                            label: aO,
                            value: aO,
                            type: 'option'
                        } as IResourceOption)
                )
            )
        );
    }, [additionalOptionsProp, displayField]);

    // update the selected option with the one after fetching resources to include the 'data' field in the option
    useEffect(() => {
        if (selectedOption) {
            const selectedOptionInOptions = optionsFromResources
                .filter(isResourceOption)
                .find((option) =>
                    areResourceValuesEqual(
                        option.label,
                        selectedOption.label,
                        displayField
                    )
                ) as IResourceOption;
            if (selectedOptionInOptions) {
                setSelectedOption(selectedOptionInOptions);
            }
        }
    }, [optionsFromResources, selectedOption]);

    const inputError = useMemo(() => {
        if (
            selectedOption &&
            ((displayField === AzureResourceDisplayFields.url &&
                !isValidUrlStr(selectedOption.label, resourceType)) ||
                errorProp?.message)
        ) {
            switch (resourceType.toLowerCase()) {
                case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                    return (
                        errorProp?.message ||
                        t('resourcesPicker.errors.invalidEnvironmentUrl')
                    );
                case AzureResourceTypes.StorageAccount.toLowerCase():
                    return (
                        errorProp?.message ||
                        t('resourcesPicker.errors.invalidStorageAccountUrl')
                    );
                case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                    return (
                        errorProp?.message ||
                        t('resourcesPicker.errors.invalidContainerUrl')
                    );
                default:
                    return undefined;
            }
        }
    }, [selectedOption, resourceType, t, displayField, errorProp]);

    /** notify the change when:
     * 1- selected option is changed by its key (e.g. when option change in the dropdown or when the resource data fetched and merged with existing one)
     * 2- options is updated by its length to keep track of removing an option as well
     */
    useEffect(() => {
        if (onChange) {
            onChange(selectedOption?.value, getResourcesFromOptions(options));
        }
    }, [selectedOption?.value, options.length]);

    const handleOnChange = useCallback(
        (
            newValue: IResourceOption,
            actionMeta: ActionMeta<IResourceOption>
        ) => {
            setSearchValue(newValue?.label ?? '');
            if (actionMeta.action === 'create-option') {
                const newParsedOptionValue = sanitizeOptionText(
                    newValue.label,
                    displayField,
                    resourceType
                );
                const newOption: IResourceOption = {
                    label: newParsedOptionValue,
                    value: newParsedOptionValue,
                    type: 'option'
                };

                if (
                    displayField !== AzureResourceDisplayFields.url ||
                    (displayField === AzureResourceDisplayFields.url &&
                        isValidUrlStr(newParsedOptionValue, resourceType))
                ) {
                    const existingOption = options
                        .filter(isResourceOption)
                        .find((option) =>
                            areResourceValuesEqual(
                                option.label,
                                newParsedOptionValue,
                                displayField
                            )
                        ) as IResourceOption;
                    if (!existingOption) {
                        setAdditionalOptions(
                            additionalOptions.concat(newOption)
                        );
                        setSelectedOption(newOption);
                    } else {
                        setSelectedOption(existingOption);
                    }
                } else {
                    setSelectedOption(newOption);
                }
            } else {
                setSelectedOption(newValue);
            }
        },
        [additionalOptions]
    );

    const handleOnInputChange = useCallback(
        (inputValue: string, actionMeta: InputActionMeta) => {
            switch (actionMeta.action) {
                case 'input-change':
                    setSearchValue(inputValue);
                    if (!inputValue && actionMeta.prevInputValue) {
                        setSelectedOption(null);
                    }
                    break;
                case 'menu-close':
                case 'input-blur':
                    // revert the text value back to the previously selected value instead of keeping the typed value
                    setSearchValue(selectedOption?.label ?? '');
                    break;
            }
        },
        [options, additionalOptions, displayField, resourceType]
    );

    const handleOnRemove = useCallback(
        (option: IResourceOption) => {
            const newAdditionOptions = deepCopy(additionalOptions);
            const optionIndexToRemove = additionalOptions.findIndex(
                (aO) => aO.label === option.label
            );
            newAdditionOptions.splice(optionIndexToRemove, 1);
            setAdditionalOptions(newAdditionOptions);

            if (option.label === selectedOption?.label) {
                setSearchValue('');
                setSelectedOption(null);
            }
        },
        [additionalOptions, selectedOption]
    );

    // styles
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });
    const reactSelectStyles = getReactSelectStyles(theme, {
        menu: { marginTop: 0 }
    });

    const dropdownLabel: JSX.Element = useMemo(
        () => (
            <div className={classNames.labelContainer}>
                <Label
                    className={classNames.label}
                    id={'resource-picker-dropdown-label'}
                >
                    {label}
                </Label>
                {error && (
                    <MessageBar
                        messageBarType={MessageBarType.error}
                        isMultiline={false}
                        onDismiss={() => {
                            setError(null);
                        }}
                        dismissButtonAriaLabel={t('close')}
                        styles={classNames.subComponentStyles.errorMessageBar}
                    >
                        {error.name}
                    </MessageBar>
                )}
            </div>
        ),
        [error, classNames, resourcesState, label, loadingLabel, t]
    );

    const CustomMenuList = (props) => {
        const OPTION_HEIGHT = 32;
        const { options, children, maxHeight, getValue, selectProps } = props;
        const [value] = getValue();
        let initialOffset = 0;
        const selectedIdx =
            options?.findIndex((o) => o.label === value?.label) || -1;
        if (!selectProps.inputValue && selectedIdx !== -1) {
            const offsetFromTop = selectedIdx * OPTION_HEIGHT;
            if (offsetFromTop + OPTION_HEIGHT >= maxHeight) {
                /**
                 * Set the initial offset to the selected option in the options list if there is no input entered for filtering.
                 * Note that searchValue does not necessarily need to be equal to the input value in the react-select component;
                 * searchValue is only used to mark option which is initially equal to the selected option value,
                 * later equal to the input value of react-select component when filtering is active with user input
                 */
                initialOffset = selectedIdx * OPTION_HEIGHT;
            }
        }

        return options.length <= 1 ? (
            <components.MenuList {...props} />
        ) : (
            <FixedSizeList
                height={maxHeight}
                itemCount={children.length}
                itemSize={OPTION_HEIGHT}
                className={classNames.menuList}
                initialScrollOffset={initialOffset}
            >
                {({ index, style }) => (
                    <div style={style}>{children[index]}</div>
                )}
            </FixedSizeList>
        );
    };

    const CustomOption = (props) => {
        if (!isResourceOption(props.data)) {
            // disable mouse interactions if it is header type of option
            delete props.innerProps.onMouseMove;
            delete props.innerProps.onMouseOver;
        }
        return (
            <div className={classNames.optionWrapper}>
                <components.Option
                    {...props}
                    isDisabled={!isResourceOption(props.data)}
                >
                    {props.data.__isNew__ ? (
                        <span className={classNames.noMatchingOptionText}>
                            {props.data.label}
                        </span>
                    ) : !isResourceOption(props.data) ? (
                        <span className={classNames.optionHeaderText}>
                            {props.data.label}
                        </span>
                    ) : (
                        <>
                            <div className={classNames.optionText}>
                                {getMarkedHtmlBySearch(
                                    props.data.label,
                                    searchValue
                                )}
                            </div>
                            {!resourcesState.isLoading &&
                                resourcesState.adapterResult?.result?.data?.findIndex(
                                    (r) => r.id === props.data.value.id
                                ) === -1 && (
                                    <IconButton
                                        iconProps={{
                                            iconName: 'Delete'
                                        }}
                                        styles={{
                                            root: { padding: '0 0 0 12px' }
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleOnRemove(props.data);
                                        }}
                                        title={t(
                                            'resourcesPicker.removeFromList'
                                        )}
                                    />
                                )}
                        </>
                    )}
                </components.Option>
            </div>
        );
    };

    const formatCreateLabel = (inputValue: string) =>
        `${t('resourcesPicker.useNonExistingResource')} "${inputValue}"`;
    const noOptionsMessage = () => t('resourcesPicker.noOption');
    const loadingMessage = () => loadingLabelText;
    const customFilter = (option: any, inputValue: string) => {
        if (!inputValue) return true;
        if (
            (isResourceOption(option.data) &&
                option.data.label
                    ?.toLowerCase()
                    .includes(inputValue?.toLowerCase())) ||
            option.data.__isNew__
        ) {
            return true;
        }
    };

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 4 }}>
                {label && <Stack horizontal>{dropdownLabel}</Stack>}
                <CreatableSelect
                    aria-labelledby="resource-picker-dropdown-label"
                    styles={reactSelectStyles}
                    options={resourcesState.isLoading ? [] : options}
                    value={selectedOption}
                    defaultValue={selectedOption ?? undefined}
                    placeholder={placeholder()}
                    formatCreateLabel={formatCreateLabel}
                    noOptionsMessage={noOptionsMessage}
                    isClearable
                    isSearchable
                    isLoading={resourcesState.isLoading}
                    isDisabled={disabled}
                    components={{
                        Option: CustomOption,
                        MenuList: CustomMenuList
                    }}
                    onChange={handleOnChange}
                    onInputChange={handleOnInputChange}
                    loadingMessage={loadingMessage}
                    filterOption={customFilter}
                />
                {inputError && (
                    <Text
                        className={
                            errorProp && !errorProp.isCatastrophic
                                ? classNames.warningText
                                : classNames.errorText
                        }
                        variant={'small'}
                    >
                        {inputError}
                    </Text>
                )}
            </Stack>
        </div>
    );
};

const sanitizeOptionText = (
    value: string,
    displayField: AzureResourceDisplayFields,
    resourceType: AzureResourceTypes
) => {
    if (!value) return value;

    if (displayField === AzureResourceDisplayFields.url) {
        // let user enter hostname and gracefully append https protocol
        let newVal = value;
        if (!newVal.startsWith('https://')) {
            if (
                (resourceType === AzureResourceTypes.DigitalTwinInstance &&
                    ValidAdtHostSuffixes.some(
                        (suffix) =>
                            newVal.endsWith(suffix) ||
                            newVal.endsWith(suffix + '/')
                    )) ||
                ((resourceType === AzureResourceTypes.StorageBlobContainer ||
                    resourceType === AzureResourceTypes.StorageAccount) &&
                    ValidContainerHostSuffixes.some(
                        (suffix) =>
                            newVal.endsWith(suffix) ||
                            newVal.endsWith(suffix + '/')
                    ))
            ) {
                newVal = 'https://' + newVal;
            }
        }
        return newVal;
    } else {
        return value;
    }
};

const isValidUrlStr = (urlStr: string, resourceType: AzureResourceTypes) => {
    try {
        let endsWithValidSuffix = true;
        const urlObj = getUrlFromString(urlStr);
        switch (resourceType.toLowerCase()) {
            case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                endsWithValidSuffix = ValidAdtHostSuffixes.some((suffix) =>
                    urlObj.hostname.endsWith(suffix)
                );
                break;
            case AzureResourceTypes.StorageAccount.toLowerCase():
            case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                endsWithValidSuffix = ValidContainerHostSuffixes.some(
                    (suffix) => urlObj.hostname.endsWith(suffix)
                );
                break;
        }
        return urlStr && urlStr.startsWith('https://') && endsWithValidSuffix;
    } catch (error) {
        return false;
    }
};

export default memo(
    styled<
        IResourcePickerProps,
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >(ResourcePicker, getStyles)
);
