import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    IDataPusherContext,
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles,
    IReactSelectOption
} from './DataPusher.types';
import { getStyles } from './DataPusher.styles';
import {
    classNamesFunction,
    Pivot,
    PivotItem,
    Stack,
    styled,
    Text
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import {
    getDebugLogger,
    isValidADXClusterUrl
} from '../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import Ingest from './Internal/Ingest';
import Cook from './Internal/Cook';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { getReactSelectStyles } from '../../../../Resources/Styles/ReactSelect.styles';
import CreatableSelect from 'react-select/creatable';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataPusher', debugLogging);

const getClassNames = classNamesFunction<
    IDataPusherStyleProps,
    IDataPusherStyles
>();

export const DataPusherContext = React.createContext<IDataPusherContext>(null);
export const useDataPusherContext = () => useContext(DataPusherContext);

const DataPusher: React.FC<IDataPusherProps> = (props) => {
    const { adapter, styles } = props;

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
        },
        [adapter]
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
    const classNames = getClassNames(styles, {
        theme
    });
    const selectStyles = useMemo(() => getReactSelectStyles(theme, {}), [
        theme
    ]);

    logDebugConsole('debug', 'Render');
    return (
        <DataPusherContext.Provider
            value={{
                adapter,
                classNames
            }}
        >
            <div className={classNames.root}>
                <h3>{t('legionApp.dataPusher.title')}</h3>
                <Stack styles={{ root: classNames.connection }}>
                    <CreatableSelect
                        onChange={handleClusterUrlChange}
                        isClearable
                        options={clusterOptions}
                        placeholder={t(
                            'legionApp.dataPusher.clusterSelectPlaceholder'
                        )}
                        styles={selectStyles}
                        isLoading={getClustersState.isLoading}
                        value={selectedCluster}
                        formatCreateLabel={formatCreateLabel}
                    />
                    {selectedCluster &&
                        !isValidADXClusterUrl(selectedCluster.label) && (
                            <Text
                                variant={'small'}
                                styles={{
                                    root: {
                                        color: theme.semanticColors.errorText
                                    }
                                }}
                            >
                                {t(
                                    'legionApp.dataPusher.notValidClusterMessage'
                                )}
                            </Text>
                        )}
                </Stack>

                <Pivot key={selectedCluster?.label}>
                    <PivotItem
                        headerText={t('legionApp.dataPusher.tabs.ingest')}
                    >
                        <Ingest />
                    </PivotItem>
                    <PivotItem headerText={t('legionApp.dataPusher.tabs.cook')}>
                        <Cook />
                    </PivotItem>
                </Pivot>
            </div>
        </DataPusherContext.Provider>
    );
};

export default styled<
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles
>(DataPusher, getStyles);
