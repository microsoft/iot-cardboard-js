import React, { useCallback, useMemo, useState } from 'react';
import {
    classNamesFunction,
    DetailsList,
    IColumn,
    Selection,
    styled,
    Stack,
    SelectionMode,
    PrimaryButton
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IStoreListProps,
    IStoreListStyleProps,
    IStoreListStyles
} from './StoreList.types';
import { getStyles } from './StoreList.styles';
import { ITargetDatabaseConnection } from '../../Contexts/AppDataContext/AppDataContext.types';

import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import { LOCAL_STORAGE_KEYS } from '../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreList', debugLogging);

const getClassNames = classNamesFunction<
    IStoreListStyleProps,
    IStoreListStyles
>();

const columns: IColumn[] = [
    {
        key: 'name',
        name: i18n.t('legionApp.StoreListPage.Columns.nameColumn'),
        fieldName: 'databaseName',
        minWidth: 100,
        maxWidth: 200
    },
    {
        key: 'url',
        name: i18n.t('legionApp.StoreListPage.Columns.urlColumn'),
        fieldName: 'clusterUrl',
        minWidth: 300
    }
];

const MOCK_STORE_LIST: ITargetDatabaseConnection[] = [
    {
        databaseName: 'My Estero DB',
        clusterUrl: 'http://esterodb.kusto.com'
    },
    {
        databaseName: 'Database 2',
        clusterUrl: 'http://database2.kusto.com'
    },
    {
        databaseName: 'Database 3',
        clusterUrl: 'http://db3.kusto.com'
    }
];

const StoreList: React.FC<IStoreListProps> = (props) => {
    const { initialTargetDatabase, onNavigateNext, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts

    // state
    const [
        selectedItem,
        setSelectedItem
    ] = useState<ITargetDatabaseConnection | null>(initialTargetDatabase);
    const selection = useMemo(() => {
        return new Selection({
            onSelectionChanged: () => {
                const selected = selection.getSelection()[0] as ITargetDatabaseConnection;
                logDebugConsole('info', 'Selected item {item}', selected);
                setSelectedItem(selected);
            }
        });
    }, []);

    // hooks

    // data
    const items: ITargetDatabaseConnection[] = useMemo(() => {
        // read local storage
        const storageData = localStorage.getItem(
            LOCAL_STORAGE_KEYS.StoreList.existingTargetDatabases
        );
        if (storageData) {
            return (
                (JSON.parse(storageData) as ITargetDatabaseConnection[]) ||
                MOCK_STORE_LIST
            );
        }
        return MOCK_STORE_LIST;
    }, []);

    // callbacks
    const onNextClick = useCallback(() => {
        // store to local storage
        onNavigateNext({
            targetDatabase: selectedItem
        });
    }, [onNavigateNext, selectedItem]);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render {selected}', selectedItem);

    return (
        <Stack className={classNames.root}>
            <DetailsList
                items={items}
                columns={columns}
                selection={selection}
                selectionPreservedOnEmptyClick={true}
                selectionMode={SelectionMode.single}
            />
            <PrimaryButton
                text={t('next')}
                onClick={onNextClick}
                disabled={!selectedItem}
            />
        </Stack>
    );
};

export default styled<IStoreListProps, IStoreListStyleProps, IStoreListStyles>(
    StoreList,
    getStyles
);
