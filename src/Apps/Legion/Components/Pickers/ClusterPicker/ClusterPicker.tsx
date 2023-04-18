import React, { useCallback, useEffect, useState } from 'react';
import {
    Label,
    Stack,
    Text,
    classNamesFunction,
    styled
} from '@fluentui/react';
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
import CreatableSelect from 'react-select/creatable';
import TooltipCallout from '../../../../../Components/TooltipCallout/TooltipCallout';
import { useAdapter } from '../../../../../Models/Hooks';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import { IReactSelectOption } from '../../../Models/Interfaces';
import { useContextAdapter } from '../../../Hooks/useContextAdapter';
import { ActionMeta } from 'react-select';
import { WizardDataManagementContext } from '../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';

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

    const adapter = useContextAdapter(targetAdapterContext);
    const getClustersState = useAdapter({
        adapterMethod: () => adapter.getClusters(),
        refetchDependencies: []
    });

    //callbacks
    const handleClusterUrlChange = useCallback(
        (newValue: any, actionMeta: ActionMeta<any>) => {
            setSelectedClusterOption(newValue);
            if (actionMeta.action === 'create-option') {
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
        (inputValue: string) => `${t('add')} "${inputValue}"`,
        [t]
    );
    const isCreateVisible = useCallback(
        (inputValue) => isCreatable && !!inputValue,
        [isCreatable]
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
    const selectStyles = getReactSelectStyles(theme, {});

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Stack horizontal verticalAlign={'center'}>
                <Label required>
                    {label || t('legionApp.dataPusher.clusterTitle')}
                </Label>
                {hasTooltip && (
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                'legionApp.dataPusher.clusterSelectInfo'
                            ),
                            calloutContent: t(
                                'legionApp.dataPusher.clusterSelectInfo'
                            )
                        }}
                    />
                )}
            </Stack>
            <CreatableSelect
                onChange={handleClusterUrlChange}
                isClearable
                options={clusterOptions}
                placeholder={
                    placeholder ||
                    t('legionApp.dataPusher.clusterSelectPlaceholder')
                }
                styles={selectStyles}
                isLoading={getClustersState.isLoading}
                value={selectedClusterOption}
                formatCreateLabel={formatCreateLabel}
                isValidNewOption={isCreateVisible}
            />
            {selectedClusterOption &&
                !isValidADXClusterUrl(selectedClusterOption.label) && (
                    <Text
                        variant={'small'}
                        styles={{
                            root: {
                                color: theme.semanticColors.errorText
                            }
                        }}
                    >
                        {t('legionApp.dataPusher.notValidClusterMessage')}
                    </Text>
                )}
        </div>
    );
};

export default styled<
    IClusterPickerProps,
    IClusterPickerStyleProps,
    IClusterPickerStyles
>(ClusterPicker, getStyles);
