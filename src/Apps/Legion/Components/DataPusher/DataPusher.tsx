import React, { useCallback, useContext, useState } from 'react';
import {
    IDataPusherContext,
    IDataPusherProps,
    IDataPusherStyleProps,
    IDataPusherStyles
} from './DataPusher.types';
import { getStyles } from './DataPusher.styles';
import {
    classNamesFunction,
    Pivot,
    PivotItem,
    styled,
    TextField
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import {
    getDebugLogger,
    isValidADXClusterUrl
} from '../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import Ingest from './Internal/Ingest';
import Cook from './Internal/Cook';

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
    const [selectedClusterUrl, setSelectedClusterUrl] = useState<string>(null);

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    //callbacks
    const handleClusterUrlChange = useCallback((_event, newValue: string) => {
        setSelectedClusterUrl(newValue);
        if (isValidADXClusterUrl(newValue)) {
            adapter.connectionString = newValue;
        }
    }, []);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });

    logDebugConsole('debug', 'Render');
    return (
        <DataPusherContext.Provider
            value={{
                adapter,
                classNames
            }}
        >
            <div className={classNames.root}>
                <h3 style={{ marginTop: 0 }}>
                    {t('legionApp.dataPusher.title')}
                </h3>
                <TextField
                    required
                    label={t('legionApp.dataPusher.clusterTitle')}
                    placeholder={t(
                        'legionApp.dataPusher.clusterTitlePlaceholder'
                    )}
                    value={selectedClusterUrl}
                    onChange={handleClusterUrlChange}
                    styles={classNames.subComponentStyles.connectionString}
                    errorMessage={
                        selectedClusterUrl &&
                        !isValidADXClusterUrl(selectedClusterUrl)
                            ? t('legionApp.dataPusher.notValidClusterMessage')
                            : null
                    }
                />
                <Pivot key={selectedClusterUrl}>
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
