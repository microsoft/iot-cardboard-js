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
    ValidAdtHostSuffixes,
    ValidContainerHostSuffixes
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import { deepCopy } from '../../Models/Services/Utils';

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

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState<IComboBoxOption>(
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
    const [selectedKey, setSelectedKey] = useState<string>(null); // resource id or the option text if manually entered option
    const [error, setError] = useState(null);
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

    const placeholder = useMemo(() => {
        if (displayField === AzureResourceDisplayFields.url) {
            switch (resourceType) {
                case AzureResourceTypes.DigitalTwinInstance:
                    return t('resourcesPicker.enterEnvironmentUrl');
                case AzureResourceTypes.StorageAccount:
                    return t('resourcesPicker.enterStorageAccountUrl');
                case AzureResourceTypes.StorageBlobContainer:
                    return t('resourcesPicker.enterContainerUrl');
                default:
                    return 'resourcesPicker.select';
            }
        } else {
            if (options.length) {
                return t('resourcesPicker.select');
            } else {
                return t('resourcesPicker.noOption');
            }
        }
    }, [resourceType, t, options.length, displayField]);

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

    const areValuesEqual = useCallback(
        (value1: string, value2: string) => {
            if (displayField === AzureResourceDisplayFields.url) {
                if (value1?.endsWith('/')) {
                    value1 = value1.slice(0, -1);
                }
                if (value2?.endsWith('/')) {
                    value2 = value2.slice(0, -1);
                }
                return value1 === value2;
            } else {
                return value1 === value2;
            }
        },
        [displayField]
    );

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

    // after fetching the resources merge them with existing options in the dropdown
    const mergeOptionsWithProps = useCallback(
        (
            options: IComboBoxOption[],
            additionalOptions: IComboBoxOption[],
            selectedOption: IComboBoxOption
        ) => {
            if (additionalOptions) {
                // do the merging with existing options: add the additional options manually entered by user to the end if it is not in the fetched data
                const existingOptionTexts =
                    resourcesRef.current?.map((resource) =>
                        getDisplayFieldValue(resource)
                    ) || [];

                const optionsToAdd = additionalOptions.filter(
                    (additionalOption) =>
                        existingOptionTexts.findIndex((existingOptionText) =>
                            areValuesEqual(
                                existingOptionText,
                                additionalOption.text
                            )
                        ) === -1
                );

                if (optionsToAdd.length) {
                    if (resourcesRef.current?.length > 0) {
                        // add the freeform options header if the resources are fetched and exists
                        options.push(freeformOptionsHeader);
                    }
                    options = options.concat(optionsToAdd);
                }
            }
            if (selectedOption) {
                const selectedOptionInNewOptions = options.find((option) =>
                    areValuesEqual(option.text, selectedOption.text)
                );
                if (!selectedOptionInNewOptions) {
                    const freeFromOptionsHeaderExist = options?.find(
                        (option) =>
                            option.itemType ===
                                SelectableOptionMenuItemType.Header &&
                            option.text === freeformOptionsHeaderText
                    );
                    if (!freeFromOptionsHeaderExist) {
                        options.push(freeformOptionsHeader);
                    }
                    options = options.concat([selectedOption]);
                } else {
                    setSelectedKey(
                        selectedOptionInNewOptions.data?.id ||
                            selectedOption.text
                    );
                }
            }
            return options;
        },
        [areValuesEqual, getDisplayFieldValue]
    );

    const getOptionsFromResources = useCallback(
        (resources: IAzureResource[]) => {
            const newOptions: Array<IComboBoxOption> = [];
            let lastHeader = '';
            // after fetching resources, first start the dropdown with that
            resources?.forEach((r) => {
                if (r.subscriptionName && lastHeader !== r.subscriptionName) {
                    newOptions.push({
                        key: r.subscriptionName,
                        text: r.subscriptionName,
                        itemType: SelectableOptionMenuItemType.Header
                    });
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
        },
        [getDisplayFieldValue, displayField, t]
    );

    const getResourcesFromOptions = (options: Array<IComboBoxOption>) => {
        return options
            ?.filter(
                (option) =>
                    option.itemType !== SelectableOptionMenuItemType.Header
            )
            .map((option) => option.data || option.text);
    };

    // reset the dropdown options after fetching data, first options are resources, last items are the freeform added ones
    useEffect(() => {
        let newOptions: Array<IComboBoxOption> = [];
        if (resourcesState.adapterResult.getCatastrophicError()) {
            resourcesRef.current = null;
            setError(resourcesState.adapterResult.getCatastrophicError());
            newOptions = additionalOptions || [];
            if (
                selectedOption &&
                !additionalOptions?.find((o) => o.text === selectedOption.text)
            ) {
                newOptions = newOptions.concat([selectedOption]);
            }
        } else if (!resourcesState.adapterResult.hasNoData()) {
            const resources: Array<IAzureResource> =
                resourcesState.adapterResult.result?.data;
            resourcesRef.current = resources;

            if (onLoaded) {
                onLoaded(resources);
            }

            newOptions = mergeOptionsWithProps(
                getOptionsFromResources(resources),
                additionalOptions,
                selectedOption
            );
        } else {
            resourcesRef.current = [];
            // by default on mount, set the options as additional options and/or selected option for the dropdown
            if (additionalOptions) {
                newOptions = additionalOptions;
            }
            if (
                selectedOption &&
                !additionalOptions?.find((o) => o.text === selectedOption.text)
            ) {
                newOptions = newOptions.concat([selectedOption]);
            }
        }

        setOptions(newOptions);
    }, [
        resourcesState.adapterResult,
        additionalOptions,
        getOptionsFromResources,
        mergeOptionsWithProps,
        onLoaded,
        selectedOption
    ]);

    useEffect(() => {
        if (selectedOptionProp) {
            setSelectedOption({
                key: selectedOptionProp,
                text: selectedOptionProp,
                styles: comboBoxOptionStyles
            });
        } else {
            setSelectedOption(null);
        }
    }, [selectedOptionProp]);

    useEffect(() => {
        if (selectedOption) {
            const selectedKey = options?.find(
                (option) =>
                    option.text ===
                    sanitizeOptionText(
                        selectedOption.text,
                        displayField,
                        resourceType
                    )
            )?.key;
            setSelectedKey(selectedKey);
        } else {
            setSelectedKey(null);
        }
    }, [selectedOption, options, displayField, resourceType]);

    useEffect(() => {
        setAdditionalOptions(
            additionalOptionsProp?.map((aO) => ({
                key: aO,
                text: aO,
                styles: comboBoxOptionStyles
            })) || []
        );
    }, [additionalOptionsProp]);

    useEffect(() => {
        setOptions(
            mergeOptionsWithProps(
                getOptionsFromResources(resourcesRef.current),
                additionalOptions,
                selectedOption
            )
        );
    }, [
        additionalOptions,
        getOptionsFromResources,
        mergeOptionsWithProps,
        selectedOption
    ]);

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

    const handleOnChange = useCallback(
        (option, value) => {
            // when allowfreeform prop is enabled for the ComboBox fluent component, two mutually exclusive parameters are passed with onchange: option and value.
            // 'option' is referring to an existing dropdown option whereas 'value' is the newly entered freeform value, so when we select from an
            // existing option, option is not null and value is null; when we enter a new value using freeform, value is not null and option is null
            if (option) {
                setSelectedOption(option);
                setSelectedKey(option.data?.id ?? option.text);
                if (onChange) {
                    onChange(
                        option.data || option.text,
                        getResourcesFromOptions(options) || []
                    );
                }
            } else {
                const newParsedOptionValue = sanitizeOptionText(
                    value,
                    displayField,
                    resourceType
                );

                const existingOption = options.find((option) =>
                    areValuesEqual(option.text, newParsedOptionValue)
                );
                if (!existingOption) {
                    const newOption = {
                        key: newParsedOptionValue,
                        text: newParsedOptionValue,
                        styles: comboBoxOptionStyles
                    };

                    let newOptions = deepCopy(options);
                    if (
                        displayField !== AzureResourceDisplayFields.url ||
                        (displayField === AzureResourceDisplayFields.url &&
                            isValidUrlStr(newParsedOptionValue, resourceType))
                    ) {
                        const freeFromOptionsHeaderExist = options?.find(
                            (option) =>
                                option.itemType ===
                                    SelectableOptionMenuItemType.Header &&
                                option.text === freeformOptionsHeaderText
                        );
                        newOptions = freeFromOptionsHeaderExist
                            ? [...newOptions, newOption]
                            : [...newOptions, freeformOptionsHeader, newOption];
                        setOptions(newOptions);
                        setSelectedOption(newOption);
                        setSelectedKey(newParsedOptionValue);
                    }
                    if (onChange)
                        onChange(
                            newParsedOptionValue,
                            getResourcesFromOptions(newOptions) || []
                        );
                } else {
                    setSelectedOption(existingOption);
                    setSelectedKey(existingOption.key);
                    if (onChange)
                        onChange(
                            existingOption.data || existingOption.text,
                            getResourcesFromOptions(options) || []
                        );
                }
            }
        },
        [options, areValuesEqual, displayField, onChange, resourceType]
    );

    const handleOnRemove = useCallback(
        (option: IComboBoxOption) => {
            const restOfOptions = options.filter((o) => o.key !== option.key);
            if (restOfOptions.length) {
                const lastOption = restOfOptions[restOfOptions.length - 1];
                if (
                    lastOption.itemType === SelectableOptionMenuItemType.Header
                ) {
                    // remove the '---' freeform options header if there is no option below
                    restOfOptions.splice(-1);
                }
            }
            setOptions(restOfOptions);

            const restOfResources = getResourcesFromOptions(restOfOptions);
            if (option.key === selectedOption?.key) {
                setSelectedOption(null);
                if (onChange) onChange(null, restOfResources);
            } else {
                if (onChange)
                    onChange(
                        selectedOption?.data || selectedOption?.text,
                        restOfResources
                    );
            }
        },
        [options, selectedOption, onChange]
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
