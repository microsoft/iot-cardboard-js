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
    IResourcePickerProps,
    IResourcePickerStyleProps,
    IResourcePickerStyles
} from './ResourcePicker.types';
import { getStyles } from './ResourcePicker.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    MessageBarType,
    MessageBar,
    Icon,
    Stack,
    Label,
    Text
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
import {
    ActionMeta,
    components,
    createFilter,
    InputActionMeta
} from 'react-select';

const freeformOptionsHeaderText = '---';
const freeformOptionsHeader: IResourceOption = {
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
    errorMessage
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
                return t('resourcesPicker.loadingInstances');
            case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                return t('resourcesPicker.loadingContainers');
            case AzureResourceTypes.StorageAccount.toLowerCase():
                return t('resourcesPicker.loadingStorageAccounts');
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
        const newOptions: Array<IResourceOption> = [];
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

    const options: Array<IResourceOption> = useMemo(() => {
        let mergedOptions: Array<IResourceOption> = [];

        // Step-1: Construct the options from fetched resources - if exists
        mergedOptions = mergedOptions.concat(optionsFromResources);

        // Step-2: Append additonal options to the options if not already there
        if (additionalOptions) {
            const optionsToAdd = additionalOptions.filter(
                (additionalOption) =>
                    optionsFromResources.findIndex((option) =>
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
                            option.type === 'header' &&
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
        if (displayField === AzureResourceDisplayFields.url) {
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
        } else {
            return t('resourcesPicker.selectResourcePlaceholder');
        }
    };

    const getResourcesFromOptions = (
        options: Array<IResourceOption>
    ): Array<IAzureResource | string> => {
        return options
            ?.filter((option) => option.type === 'option')
            .map((option) => option.value);
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
            const existingOption = options?.find((o) =>
                areResourceValuesEqual(
                    o.label,
                    selectedOptionProp,
                    displayField
                )
            );
            if (existingOption) {
                setSelectedOption(existingOption);
            } else {
                setSelectedOption({
                    label: selectedOptionProp,
                    value: selectedOptionProp,
                    type: 'option'
                });
            }
        } else {
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
            const selectedOptionInOptions = optionsFromResources.find(
                (option) =>
                    areResourceValuesEqual(
                        option.label,
                        selectedOption.label,
                        displayField
                    )
            );
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
                errorMessage)
        ) {
            switch (resourceType.toLowerCase()) {
                case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                    return (
                        errorMessage ||
                        t('resourcesPicker.errors.invalidEnvironmentUrl')
                    );
                case AzureResourceTypes.StorageAccount.toLowerCase():
                    return (
                        errorMessage ||
                        t('resourcesPicker.errors.invalidStorageAccountUrl')
                    );
                case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                    return (
                        errorMessage ||
                        t('resourcesPicker.errors.invalidContainerUrl')
                    );
                default:
                    return undefined;
            }
        }
    }, [selectedOption, resourceType, t, displayField, errorMessage]);

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
            setSearchValue(newValue?.label);
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
                    const existingOption = options.find((option) =>
                        areResourceValuesEqual(
                            option.label,
                            newParsedOptionValue,
                            displayField
                        )
                    );
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
        []
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
                setSearchValue(null);
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
        const { children, maxHeight } = props;

        return options.length <= 1 ? (
            <components.MenuList {...props} />
        ) : (
            <FixedSizeList
                height={maxHeight}
                itemCount={children.length}
                itemSize={OPTION_HEIGHT}
                className={classNames.menuList}
            >
                {({ index, style }) => (
                    <div style={style}>{children[index]}</div>
                )}
            </FixedSizeList>
        );
    };

    const CustomOption = (props) => {
        if (props.data.type === 'header') {
            delete props.innerProps.onMouseMove;
            delete props.innerProps.onMouseOver;
        }
        return (
            <div className={classNames.optionWrapper}>
                <components.Option
                    {...props}
                    isDisabled={props.data.type === 'header'}
                >
                    {props.data.__isNew__ ? (
                        <span className={classNames.noMatchingOptionText}>
                            {props.data.label}
                        </span>
                    ) : props.data.type === 'header' ? (
                        <span className={classNames.optionHeaderText}>
                            {props.data.label}
                        </span>
                    ) : (
                        <>
                            <div className={classNames.optionText}>
                                {getMarkedHtmlBySearch(
                                    props.data.label,
                                    searchValue,
                                    true
                                )}
                            </div>
                            {!resourcesState.isLoading &&
                                resourcesState.adapterResult?.result?.data?.findIndex(
                                    (r) => r.id === props.data.value.id
                                ) === -1 && (
                                    <Icon
                                        iconName="Delete"
                                        aria-hidden="true"
                                        title={t(
                                            'resourcesPicker.removeFromList'
                                        )}
                                        style={{ padding: '0 8px' }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleOnRemove(props.data);
                                        }}
                                    />
                                )}
                        </>
                    )}
                </components.Option>
            </div>
        );
    };

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 4 }}>
                {label && <Stack horizontal>{dropdownLabel}</Stack>}
                <CreatableSelect
                    aria-labelledby="resource-picker-dropdown-label"
                    styles={reactSelectStyles}
                    options={resourcesState.isLoading ? [] : options}
                    inputValue={searchValue ?? ''}
                    value={selectedOption}
                    defaultValue={selectedOption ?? undefined}
                    defaultInputValue={searchValue ?? ''}
                    placeholder={placeholder()}
                    formatCreateLabel={(inputValue: string) =>
                        `${t(
                            'resourcesPicker.useNonExistingResource'
                        )} "${inputValue}"`
                    }
                    noOptionsMessage={() => t('resourcesPicker.noOption')}
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
                    filterOption={createFilter({ ignoreAccents: false })}
                    loadingMessage={() => loadingLabelText}
                />

                {inputError && (
                    <Text className={classNames.errorText} variant={'small'}>
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
