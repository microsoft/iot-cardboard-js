import React, { useCallback, useEffect, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../../Models/Services/Utils';
import {
    IClusterPickerProps,
    IClusterPickerStyleProps,
    IClusterPickerStyles
} from './ClusterPicker.types';
import { getStyles } from './ClusterPicker.styles';
import { isValidADXClusterUrl } from '../../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import { useAdapter } from '../../../../../Models/Hooks';
import { IReactSelectOption } from '../../../Models/Types';
import { useADXAdapter } from '../../../Hooks/useADXAdapter';
import { WizardDataManagementContext } from '../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import CardboardComboBox from '../../CardboardComboBox/CardboardComboBox';
import { IADXAdapterTargetContext } from '../../../Models/Interfaces';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ClusterPicker', debugLogging);

const getClassNames = classNamesFunction<
    IClusterPickerStyleProps,
    IClusterPickerStyles
>();

const ClusterPicker: React.FC<IClusterPickerProps> = (props) => {
    const {
        selectedClusterUrl,
        onClusterUrlChange,
        targetAdapterContext = WizardDataManagementContext,
        label,
        placeholder,
        hasTooltip = false,
        isCreatable = true,
        isRequired = true,
        isDisabled = false,
        styles
    } = props;

    //state
    const [clusterOptions, setClusterOptions] = useState<
        Array<IReactSelectOption>
    >([]);
    const [
        selectedClusterOption,
        setSelectedClusterOption
    ] = useState<IReactSelectOption>(null);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const adapter = useADXAdapter(
        targetAdapterContext as React.Context<IADXAdapterTargetContext>
    );
    const getClustersState = useAdapter({
        adapterMethod: () => adapter.getClusters(),
        refetchDependencies: []
    });

    //callbacks
    const handleClusterUrlChange = useCallback(
        (newValue: IReactSelectOption, isNew: boolean) => {
            setSelectedClusterOption(newValue);
            if (isNew) {
                if (isValidADXClusterUrl(newValue.label)) {
                    adapter.connectionString = newValue.label;
                    setClusterOptions(clusterOptions.concat(newValue));
                    if (onClusterUrlChange) {
                        onClusterUrlChange(newValue.label, true);
                    }
                } else {
                    adapter.connectionString = null;
                }
            } else {
                adapter.connectionString = newValue.label;
                if (onClusterUrlChange) {
                    onClusterUrlChange(newValue.label, false);
                }
            }
        },
        [adapter, clusterOptions, onClusterUrlChange]
    );
    const formatCreateLabel = useCallback(
        (inputValue: string) =>
            `${t('legionApp.Common.addOptionFormat', { item: inputValue })}`,
        [t]
    );

    // side-effects;
    useEffect(() => {
        if (getClustersState?.adapterResult?.result) {
            const data = getClustersState.adapterResult.getData();
            setClusterOptions(data.map((d) => ({ value: d, label: d })));
        }
    }, [getClustersState?.adapterResult]);
    useEffect(() => {
        setSelectedClusterOption(
            selectedClusterUrl
                ? {
                      value: selectedClusterUrl,
                      label: selectedClusterUrl
                  }
                : null
        );
    }, [selectedClusterUrl]);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <CardboardComboBox
                isLoading={getClustersState.isLoading}
                required={isRequired}
                isCreatable={isCreatable}
                label={label || t('legionApp.Common.clusterLabel')}
                tooltip={
                    hasTooltip
                        ? {
                              content: {
                                  buttonAriaLabel: t(
                                      'legionApp.dataPusher.clusterSelectInfo'
                                  ),
                                  calloutContent: t(
                                      'legionApp.dataPusher.clusterSelectInfo'
                                  )
                              }
                          }
                        : undefined
                }
                onSelectionChange={handleClusterUrlChange}
                options={clusterOptions}
                placeholder={
                    placeholder ||
                    t('legionApp.dataPusher.clusterSelectPlaceholder')
                }
                selectedItem={selectedClusterOption}
                formatCreateLabel={formatCreateLabel}
                description={
                    selectedClusterOption &&
                    !isValidADXClusterUrl(selectedClusterOption.label)
                        ? t('legionApp.dataPusher.notValidClusterMessage')
                        : undefined
                }
                descriptionIsError={true}
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default styled<
    IClusterPickerProps,
    IClusterPickerStyleProps,
    IClusterPickerStyles
>(ClusterPicker, getStyles);
