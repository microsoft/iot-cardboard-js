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
    SelectableOptionMenuItemType
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
    onResourcesLoaded,
    onResourceChange,
    additionalOptions,
    selectedOption: selectedOptionProp,
    allowFreeform = false,
    disabled = false
}) => {
    const { t } = useTranslation();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [options, setOptions] = useState([]);
    const optionsRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState<IComboBoxOption>(
        selectedOptionProp
            ? {
                  key: selectedOptionProp,
                  text: selectedOptionProp,
                  styles: comboBoxOptionStyles
              }
            : null
    );
    const [selectedKey, setSelectedKey] = useState<string>(null); // resource id or the option text if manually entered option
    const [error, setError] = useState(null);
    const resourcesState = useAdapter({
        adapterMethod: () =>
            adapter.getResourcesByPermissions(
                resourceType,
                requiredAccessRoles,
                searchParams
            ),
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
    }, [resourceType, t, options.length]);

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

    useEffect(() => {
        let newOptions: Array<IComboBoxOption> = [];
        if (resourcesState.adapterResult.getCatastrophicError()) {
            setError(resourcesState.adapterResult.getCatastrophicError());
            newOptions =
                additionalOptions?.map(
                    (additionalOption) =>
                        ({
                            key: additionalOption,
                            text: additionalOption,
                            styles: comboBoxOptionStyles
                        } as IComboBoxOption)
                ) || [];
            if (
                selectedOption &&
                !additionalOptions?.includes(selectedOption.text)
            ) {
                newOptions = newOptions.concat([selectedOption]);
            }
        } else if (!resourcesState.adapterResult.hasNoData()) {
            const resources: Array<IAzureResource> =
                resourcesState.adapterResult.result?.data;

            if (onResourcesLoaded) {
                onResourcesLoaded(resources);
            }

            let lastHeader = '';
            // after fetching resources, first attempt to append those to the dropdown list
            resources.forEach((r) => {
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

            if (additionalOptions) {
                // do the merging with existing options: add the additional options manually entered by user to the end if it is not in the fetched data
                const existingOptionTexts = resources.map((resource) =>
                    getDisplayFieldValue(resource)
                );

                const optionsToAdd = additionalOptions
                    .filter(
                        (additionalOption) =>
                            !existingOptionTexts.includes(additionalOption)
                    )
                    .map(
                        (additionalOption) =>
                            ({
                                key: additionalOption,
                                text: additionalOption,
                                styles: comboBoxOptionStyles
                            } as IComboBoxOption)
                    );
                if (optionsToAdd.length) {
                    newOptions.push({
                        key: 'additional-options',
                        text: '---',
                        itemType: SelectableOptionMenuItemType.Header
                    });
                    newOptions = newOptions.concat(optionsToAdd);
                }
            }
            if (selectedOption) {
                const selectedOptionInNewOptions = newOptions.find(
                    (option) => option.text === selectedOption.text
                );
                if (!selectedOptionInNewOptions) {
                    if (!additionalOptions) {
                        newOptions.push({
                            key: 'additional-options',
                            text: '---',
                            itemType: SelectableOptionMenuItemType.Header
                        });
                    }
                    newOptions = newOptions.concat([selectedOption]);
                } else {
                    setSelectedKey(
                        selectedOptionInNewOptions.data?.id ||
                            selectedOption.text
                    );
                }
            }
        } else {
            // by default on mount, set the options as additional options and/or selected option for the dropdown
            if (additionalOptions) {
                newOptions = additionalOptions.map(
                    (additionalOption) =>
                        ({
                            key: additionalOption,
                            text: additionalOption,
                            styles: comboBoxOptionStyles
                        } as IComboBoxOption)
                );
            }
            if (
                selectedOption &&
                !additionalOptions?.includes(selectedOption.text)
            ) {
                newOptions = newOptions.concat([selectedOption]);
            }
        }

        setOptions(newOptions);
        optionsRef.current = newOptions;
    }, [resourcesState.adapterResult]);

    useEffect(() => {
        if (selectedOption) {
            const selectedKey = optionsRef.current?.find(
                (option) =>
                    option.text === parsedOptionText(selectedOption.text)
            )?.key;
            setSelectedKey(selectedKey);
        }
    }, [selectedOption]);

    const parsedOptionText = useCallback((value) => {
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
                    ((resourceType ===
                        AzureResourceTypes.StorageBlobContainer ||
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
    }, []);

    const isValidUrlStr = useCallback((urlStr: string) => {
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
            return (
                urlStr && urlStr.startsWith('https://') && endsWithValidSuffix
            );
        } catch (error) {
            return false;
        }
    }, []);

    const inputError = useMemo(() => {
        if (
            selectedOption &&
            displayField === AzureResourceDisplayFields.url &&
            !isValidUrlStr(selectedOption.text)
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
    }, [selectedOption, resourceType, isValidUrlStr, t]);

    const handleOnChange = useCallback((option, value) => {
        if (option) {
            setSelectedOption(option);
            setSelectedKey(option.data?.id ?? option.text);
            if (onResourceChange) {
                onResourceChange(
                    option.data || option.text,
                    optionsRef.current
                        ?.filter(
                            (option) =>
                                option.itemType !==
                                SelectableOptionMenuItemType.Header
                        )
                        .map((option) => option.data || option.text) || []
                );
            }
        } else {
            const newParsedOptionValue = parsedOptionText(value);

            const existingOption = optionsRef.current.find(
                (option) => option.text === newParsedOptionValue
            );
            if (!existingOption) {
                const newOption = {
                    key: newParsedOptionValue,
                    text: newParsedOptionValue,
                    styles: comboBoxOptionStyles
                };
                setSelectedOption(newOption);

                if (isValidUrlStr(newParsedOptionValue)) {
                    const newOptions = [
                        ...deepCopy(optionsRef.current),
                        newOption
                    ];
                    setOptions(newOptions);
                    optionsRef.current = newOptions;
                }
                if (onResourceChange)
                    onResourceChange(
                        newParsedOptionValue,
                        optionsRef.current
                            ?.filter(
                                (option) =>
                                    option.itemType !==
                                    SelectableOptionMenuItemType.Header
                            )
                            .map((option) => option.data || option.text) || []
                    );
            } else {
                setSelectedOption(existingOption);
                if (onResourceChange)
                    onResourceChange(
                        existingOption.data || existingOption.text,
                        optionsRef.current
                            ?.filter(
                                (option) =>
                                    option.itemType !==
                                    SelectableOptionMenuItemType.Header
                            )
                            .map((option) => option.data || option.text) || []
                    );
            }

            setSelectedKey(newParsedOptionValue);
        }
    }, []);

    const handleOnRemove = (option: IComboBoxOption) => {
        const restOfOptions = optionsRef.current.filter(
            (o) => o.key !== option.key
        );
        if (restOfOptions.length) {
            const lastOption = restOfOptions[restOfOptions.length - 1];
            if (lastOption.itemType === SelectableOptionMenuItemType.Header) {
                // remove the '---' header if there is no option below
                restOfOptions.splice(-1);
            }
        }
        setOptions(restOfOptions);
        optionsRef.current = restOfOptions;

        if (option.key === selectedOption?.key) {
            setSelectedOption(null);
            if (onResourceChange)
                onResourceChange(
                    null,
                    restOfOptions
                        .filter(
                            (option) =>
                                option.itemType !==
                                SelectableOptionMenuItemType.Header
                        )
                        .map((option) => option.data || option.text)
                );
        } else {
            if (onResourceChange)
                onResourceChange(
                    selectedOption?.data || selectedOption?.text,
                    restOfOptions
                        ?.filter(
                            (option) =>
                                option.itemType !==
                                SelectableOptionMenuItemType.Header
                        )
                        .map((option) => option.data || option.text)
                );
        }
    };

    const handleOnRender = (option: IComboBoxOption) => {
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
    };

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
                onRenderLabel={() => (
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
                                styles={
                                    classNames.subComponentStyles
                                        .errorMessageBar
                                }
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
                )}
                onRenderOption={handleOnRender}
            />
        </div>
    );
};

export default memo(
    styled<
        IResourcePickerProps,
        IResourcePickerStyleProps,
        IResourcePickerStyles
    >(ResourcePicker, getStyles)
);
