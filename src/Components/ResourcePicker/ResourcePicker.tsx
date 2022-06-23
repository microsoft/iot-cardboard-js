import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    VirtualizedComboBox
} from '@fluentui/react';
import useAdapter from '../../Models/Hooks/useAdapter';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureResource
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IResourcePickerStyleProps,
    IResourcePickerStyles
>();

const ResourcePicker: React.FC<IResourcePickerProps> = ({
    adapter,
    resourceType,
    requiredAccessRoles,
    displayField = AzureResourceDisplayFields.id,
    styles,
    label,
    loadingLabel,
    additionalResourceSearchParams
}) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const [error, setError] = useState(null);
    const resourcesState = useAdapter({
        adapterMethod: () =>
            adapter.getResourcesByPermissions(
                resourceType,
                requiredAccessRoles,
                { additionalParams: additionalResourceSearchParams }
            ),
        refetchDependencies: []
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
            return t('resourcesPicker.select');
        }
    }, [resourceType, t]);

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

    const getDisplayField = useCallback(
        (resource: IAzureResource) => {
            if (displayField === AzureResourceDisplayFields.url) {
                switch (resource.type) {
                    case AzureResourceTypes.DigitalTwinInstance:
                        return resource.properties.hostName
                            ? 'https://' + resource.properties.hostName
                            : null;
                    case AzureResourceTypes.StorageAccount:
                    case AzureResourceTypes.StorageBlobContainer:
                        return resource.properties.primaryEndpoints.blob;
                    default:
                        return resource[
                            AzureResourceDisplayFields[displayField]
                        ];
                }
            } else {
                return resource[AzureResourceDisplayFields[displayField]];
            }
        },
        [displayField]
    );

    useEffect(() => {
        if (resourcesState.adapterResult.getCatastrophicError()) {
            setError(resourcesState.adapterResult.getCatastrophicError());
            setOptions([]);
        } else if (!resourcesState.adapterResult.hasNoData()) {
            const resources: Array<IAzureResource> =
                resourcesState.adapterResult.result?.data;
            setOptions(
                resources.map(
                    (r) =>
                        ({
                            key: r.id,
                            text:
                                getDisplayField(r) ||
                                t('resourcesPicker.displayFieldNotFound', {
                                    displayField:
                                        AzureResourceDisplayFields[
                                            displayField
                                        ],
                                    id: r.id
                                })
                        } as IComboBoxOption)
                )
            );
        }
    }, [resourcesState.adapterResult]);

    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    return (
        <div className={classNames.root}>
            <VirtualizedComboBox
                placeholder={placeholder}
                label={label}
                options={options}
                allowFreeform={true}
                autoComplete={'on'}
                required
                onChange={(_e, option, _idx, value) => {
                    console.log(option);
                    console.log(value);
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
            />
        </div>
    );
};

export default styled<
    IResourcePickerProps,
    IResourcePickerStyleProps,
    IResourcePickerStyles
>(ResourcePicker, getStyles);
