import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDataPusherContext } from '../DataPusher';
import { useTranslation } from 'react-i18next';
import { IReactSelectOption } from '../DataPusher.types';
import { isValidADXClusterUrl } from '../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../Models/Hooks/useExtendedTheme';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { Label, Stack, Text } from '@fluentui/react';
import CreatableSelect from 'react-select/creatable';
import React from 'react';
import { getReactSelectStyles } from '../../../../../Resources/Styles/ReactSelect.styles';
import TooltipCallout from '../../../../../Components/TooltipCallout/TooltipCallout';

interface IConnectionStringPickerProps {
    onConnectionStringChange: (clusterUrl: string) => void;
}

const ConnectionStringPicker: React.FC<IConnectionStringPickerProps> = (
    props
) => {
    const { onConnectionStringChange } = props;
    const { adapter, classNames } = useDataPusherContext();

    //state
    const [clusterOptions, setClusterOptions] = useState<
        Array<IReactSelectOption>
    >([]);
    const [selectedCluster, setSelectedCluster] = useState<IReactSelectOption>(
        null
    );

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    const getClustersState = useAdapter({
        adapterMethod: () => adapter.getClusters(),
        refetchDependencies: [adapter]
    });

    //callbacks
    const handleClusterUrlChange = useCallback(
        (newValue: any) => {
            setSelectedCluster(newValue);
            if (isValidADXClusterUrl(newValue.label)) {
                adapter.connectionString = newValue.label;
            } else {
                adapter.connectionString = null;
            }
            if (onConnectionStringChange) {
                onConnectionStringChange(newValue.label);
            }
        },
        [adapter, onConnectionStringChange]
    );
    const formatCreateLabel = (inputValue: string) =>
        `${t('add')} "${inputValue}"`;

    //side-effects
    useEffect(() => {
        if (getClustersState?.adapterResult?.result) {
            const data = getClustersState.adapterResult.getData();
            setClusterOptions(data.map((d) => ({ value: d, label: d })));
        }
    }, [getClustersState?.adapterResult]);

    // styles
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);
    return (
        <Stack styles={{ root: classNames.connection }}>
            <Stack horizontal verticalAlign={'center'}>
                <Label required>{t('legionApp.dataPusher.clusterTitle')}</Label>
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
            </Stack>
            <CreatableSelect
                onChange={handleClusterUrlChange}
                isClearable
                options={clusterOptions}
                placeholder={t('legionApp.dataPusher.clusterSelectPlaceholder')}
                styles={selectStyles}
                isLoading={getClustersState.isLoading}
                value={selectedCluster}
                formatCreateLabel={formatCreateLabel}
            />
            {selectedCluster && !isValidADXClusterUrl(selectedCluster.label) && (
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
        </Stack>
    );
};

export default ConnectionStringPicker;
