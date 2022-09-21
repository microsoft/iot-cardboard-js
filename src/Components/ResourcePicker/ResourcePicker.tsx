import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    IResourcePickerProps,
    IResourcePickerStyleProps,
    IResourcePickerStyles
} from './ResourcePicker.types';
import { getStyles } from './ResourcePicker.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Spinner,
    SpinnerSize,
    MessageBarType,
    MessageBar,
    IComboBoxOption,
    VirtualizedComboBox,
    Icon,
    SelectableOptionMenuItemType,
    IRenderFunction,
    IOnRenderComboBoxLabelProps
} from '@fluentui/react';
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
import { areResourceValuesEqual, deepCopy } from '../../Models/Services/Utils';

const comboBoxOptionStyles = {
    root: {
        width: '100%'
    },
    flexContainer: { span: { width: '100%' } }
};
const freeformOptionsHeaderText = '---';
const freeformOptionsHeader = {
    key: 'additional-options',
    text: freeformOptionsHeaderText,
    itemType: SelectableOptionMenuItemType.Header
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
    allowFreeform = false,
    disabled = false
}) => {
    const { t } = useTranslation();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [
        selectedOption,
        setSelectedOption
    ] = useState<IComboBoxOption | null>(
        selectedOptionProp
            ? {
                  key: selectedOptionProp,
                  text: selectedOptionProp,
                  styles: comboBoxOptionStyles
              }
            : null
    );
    const [additionalOptions, setAdditionalOptions] = useState<
        Array<IComboBoxOption>
    >([]);
    const [selectedKey, setSelectedKey] = useState<string | number | null>(
        selectedOptionProp
    ); // resource id or the option text if manually entered option
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
        switch (resourceType) {
            case AzureResourceTypes.DigitalTwinInstance:
                return t('resourcesPicker.loadingInstances');
            case AzureResourceTypes.StorageBlobContainer:
                return t('resourcesPicker.loadingContainers');
            case AzureResourceTypes.StorageAccount:
                return t('resourcesPicker.loadingStorageAccounts');
            default:
                return t('resourcesPicker.loadingResources');
        }
    }, [resourceType, t]);

    const getDisplayFieldValue = useCallback(
        (resource: IAzureResource) => {
            if (displayField === AzureResourceDisplayFields.url) {
                switch (resource.type) {
                    case AzureResourceTypes.DigitalTwinInstance:
                        return resource.properties.hostName
                            ? 'https://' + resource.properties.hostName
                            : null;
                    case AzureResourceTypes.StorageAccount:
                        return resource.properties.primaryEndpoints?.blob;
                    default:
                        return resource[
                            AzureResourceDisplayFields[displayField] // storage blob containers does not have url information in its resource properties, it is constructed based on the storage account blob url
                        ];
                }
            } else {
                return resource[AzureResourceDisplayFields[displayField]];
            }
        },
        [displayField]
    );

    const sortResources = (r1: IAzureResource, r2: IAzureResource) => {
        // first sort by subscription name then by displayFieldValue within the same subscription
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
        const newOptions: Array<IComboBoxOption> = [];
        let lastHeader;
        filteredAndSortedResources.forEach((r) => {
            if (r.subscriptionName && lastHeader !== r.subscriptionName) {
                newOptions.push({
                    key: r.subscriptionName,
                    text: r.subscriptionName,
                    itemType: SelectableOptionMenuItemType.Header
                });
                newOptions.push({
                    key: r.id,
                    text: getDisplayFieldValue(r),
                    data: r,
                    styles: comboBoxOptionStyles
                } as IComboBoxOption);
                lastHeader = r.subscriptionName;
            } else {
                newOptions.push({
                    key: r.id,
                    text:
                        getDisplayFieldValue(r) ||
                        t('resourcesPicker.displayFieldNotFound', {
                            displayField:
                                AzureResourceDisplayFields[displayField],
                            id: r.id
                        }),
                    data: r,
                    styles: comboBoxOptionStyles
                } as IComboBoxOption);
            }
        });
        return newOptions;
    }, [getDisplayFieldValue, displayField, t, resourcesRef.current]);

    const options: Array<IComboBoxOption> = useMemo(() => {
        let mergedOptions: Array<IComboBoxOption> = [];

        // Step-1: Construct the options from fetched resources - if exists
        mergedOptions = mergedOptions.concat(optionsFromResources);

        // Step-2: Append additonal options to the options if not already there
        if (additionalOptions) {
            const optionsToAdd = additionalOptions.filter(
                (additionalOption) =>
                    optionsFromResources.findIndex((option) =>
                        areResourceValuesEqual(
                            option.text,
                            additionalOption.text,
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
                        mergedOption.text,
                        selectedOption.text,
                        displayField
                    )
            );
            if (!selectedOptionInMergedOptions) {
                if (resourcesRef.current?.length > 0) {
                    const freeFromOptionsHeaderExist = mergedOptions?.find(
                        (option) =>
                            option.itemType ===
                                SelectableOptionMenuItemType.Header &&
                            option.text === freeformOptionsHeaderText
                    );
                    if (!freeFromOptionsHeaderExist) {
                        mergedOptions.push(freeformOptionsHeader);
                    }
                }
                mergedOptions.push(selectedOption);
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

    const placeholder = useMemo(() => {
        if (displayField === AzureResourceDisplayFields.url) {
            switch (resourceType) {
                case AzureResourceTypes.DigitalTwinInstance:
                    return t('resourcesPicker.environmentDropdownPlaceholder');
                case AzureResourceTypes.StorageAccount:
                    return t(
                        'resourcesPicker.storageAccountDropdownPlaceholder'
                    );
                case AzureResourceTypes.StorageBlobContainer:
                    return t('resourcesPicker.containerDropdownPlaceholder');
                default:
                    return 'resourcesPicker.selectResourcePlaceholder';
            }
        } else {
            if (options.length) {
                return t('resourcesPicker.selectResourcePlaceholder');
            } else {
                return t('resourcesPicker.noOption');
            }
        }
    }, [resourceType, t, options.length, displayField]);

    const getResourcesFromOptions = (
        options: Array<IComboBoxOption>
    ): Array<IAzureResource | string> => {
        return options
            ?.filter(
                (option) =>
                    option.itemType !== SelectableOptionMenuItemType.Header
            )
            .map((option) => option.data || option.text);
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
                areResourceValuesEqual(o.text, selectedOptionProp, displayField)
            );
            if (existingOption) {
                setSelectedOption(existingOption);
            } else {
                setSelectedOption({
                    key: selectedOptionProp,
                    text: selectedOptionProp,
                    styles: comboBoxOptionStyles
                });
            }
        }
    }, [selectedOptionProp]);

    useEffect(() => {
        if (selectedOption) {
            const selectedKey = options.find((option) =>
                areResourceValuesEqual(
                    option.text,
                    selectedOption.text,
                    displayField
                )
            )?.key;
            setSelectedKey(selectedKey);
        } else {
            setSelectedKey(null);
        }
    }, [selectedOption, options, displayField, resourceType]);

    useEffect(() => {
        const additionalOptionsToAdd = additionalOptionsProp.filter(
            (additionalOptionProp) =>
                additionalOptions.findIndex((additionalOption) =>
                    areResourceValuesEqual(
                        additionalOption.text,
                        additionalOptionProp,
                        displayField
                    )
                ) === -1
        );
        setAdditionalOptions(
            additionalOptions.concat(
                additionalOptionsToAdd.map((aO) => ({
                    key: aO,
                    text: aO,
                    styles: comboBoxOptionStyles
                }))
            )
        );
    }, [additionalOptionsProp, displayField]);

    // update the selected option with the one after fetching resources to include the 'data' field in the option
    useEffect(() => {
        if (selectedOption) {
            const selectedOptionInOptions = optionsFromResources.find(
                (option) =>
                    areResourceValuesEqual(
                        option.text,
                        selectedOption.text,
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
            displayField === AzureResourceDisplayFields.url &&
            !isValidUrlStr(selectedOption.text, resourceType)
        ) {
            switch (resourceType) {
                case AzureResourceTypes.DigitalTwinInstance:
                    return t('resourcesPicker.errors.invalidEnvironmentUrl');
                case AzureResourceTypes.StorageAccount:
                    return t('resourcesPicker.errors.invalidStorageAccountUrl');
                case AzureResourceTypes.StorageBlobContainer:
                    return t('resourcesPicker.errors.invalidContainerUrl');
                default:
                    return undefined;
            }
        }
    }, [selectedOption, resourceType, t, displayField]);

    /** notify the change when:
     * 1- selected option is changed by its key (e.g. when option change in the dropdown or when the resource data fetched and merged with existing one)
     * 2- options is updated by its length to keep track of removing an option as well
     */
    useEffect(() => {
        if (onChange) {
            onChange(
                selectedOption?.data || selectedOption?.text,
                getResourcesFromOptions(options)
            );
        }
    }, [selectedOption?.key, options.length]);

    const handleOnChange = useCallback(
        (option, value) => {
            /**
             * when allowfreeform prop is enabled for the ComboBox fluent component, two mutually exclusive parameters are passed with onchange: option and value.
             * 'option' is referring to an existing dropdown option whereas 'value' is the newly entered freeform value, so when we select from an
             * existing option, option is not null and value is null; when we enter a new value using freeform, value is not null and option is null
             */
            if (option) {
                setSelectedOption(option);
            } else {
                const newParsedOptionValue = sanitizeOptionText(
                    value,
                    displayField,
                    resourceType
                );

                if (
                    displayField !== AzureResourceDisplayFields.url ||
                    (displayField === AzureResourceDisplayFields.url &&
                        isValidUrlStr(newParsedOptionValue, resourceType))
                ) {
                    const existingOption = options.find((option) =>
                        areResourceValuesEqual(
                            option.text,
                            newParsedOptionValue,
                            displayField
                        )
                    );
                    if (!existingOption) {
                        const newOption = {
                            key: newParsedOptionValue,
                            text: newParsedOptionValue,
                            styles: comboBoxOptionStyles
                        };
                        setAdditionalOptions(
                            additionalOptions.concat(newOption)
                        );
                        setSelectedOption(newOption);
                    } else {
                        setSelectedOption(existingOption);
                    }
                }
            }
        },
        [options, additionalOptions, displayField, onChange, resourceType]
    );

    const handleOnRemove = useCallback(
        (option: IComboBoxOption) => {
            const newAdditionOptions = deepCopy(additionalOptions);
            const optionIndexToRemove = additionalOptions.findIndex(
                (aO) => aO.key === option.key
            );
            newAdditionOptions.splice(optionIndexToRemove, 1);
            setAdditionalOptions(newAdditionOptions);

            if (option.key === selectedOption?.key) {
                setSelectedOption(null);
            }
        },
        [additionalOptions, selectedOption]
    );

    const handleOnRender = useCallback(
        (option: IComboBoxOption) => {
            return (
                <div className={classNames.comboBoxOptionWrapper}>
                    <span className={classNames.comboBoxOptionText}>
                        {option.text}
                    </span>
                    {option.itemType !== SelectableOptionMenuItemType.Header &&
                        !resourcesState.isLoading &&
                        resourcesState.adapterResult?.result?.data?.findIndex(
                            (r) => r.id === option.key
                        ) === -1 && (
                            <Icon
                                iconName="Delete"
                                aria-hidden="true"
                                title={t('resourcesPicker.removeFromList')}
                                style={{ paddingLeft: 12 }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleOnRemove(option);
                                }}
                            />
                        )}
                </div>
            );
        },
        [classNames, resourcesState, handleOnRemove, t]
    );

    const handleOnRenderLabel: IRenderFunction<IOnRenderComboBoxLabelProps> = useCallback(
        () => (
            <div className={classNames.labelContainer}>
                <span className={classNames.label}>{label}</span>
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
                {resourcesState.isLoading && (
                    <Spinner
                        size={SpinnerSize.xSmall}
                        label={loadingLabel ?? loadingLabelText}
                        ariaLive="assertive"
                        labelPosition="right"
                    />
                )}
            </div>
        ),
        [
            error,
            classNames,
            resourcesState,
            label,
            loadingLabel,
            loadingLabelText,
            t
        ]
    );

    return (
        <div className={classNames.root}>
            <VirtualizedComboBox
                styles={classNames.subComponentStyles.comboBox()}
                placeholder={placeholder}
                label={label}
                options={options}
                selectedKey={selectedKey}
                allowFreeform={allowFreeform}
                autoComplete={'on'}
                required
                disabled={disabled}
                errorMessage={inputError}
                text={selectedOption?.text} // to show the selectedOption text even there is input error
                onChange={(_e, option, _idx, value) => {
                    handleOnChange(option, value);
                }}
                onRenderLabel={handleOnRenderLabel}
                onRenderOption={handleOnRender}
            />
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
        switch (resourceType) {
            case AzureResourceTypes.DigitalTwinInstance:
                endsWithValidSuffix = ValidAdtHostSuffixes.some((suffix) =>
                    new URL(urlStr).hostname.endsWith(suffix)
                );
                break;
            case AzureResourceTypes.StorageAccount:
            case AzureResourceTypes.StorageBlobContainer:
                endsWithValidSuffix = ValidContainerHostSuffixes.some(
                    (suffix) => new URL(urlStr).hostname.endsWith(suffix)
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
