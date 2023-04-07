import React, { useMemo, useState } from 'react';
import {
    classNamesFunction,
    DetailsList,
    IColumn,
    Selection,
    styled,
    Stack,
    DefaultButton,
    SelectionMode
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
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';

import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreList', debugLogging);

const getClassNames = classNamesFunction<
    IStoreListStyleProps,
    IStoreListStyles
>();

const columns: IColumn[] = [
    {
        key: 'name',
        name: 'Store',
        fieldName: 'databaseName',
        minWidth: 100
    }
];

const StoreList: React.FC<IStoreListProps> = (props) => {
    const { onNavigateNext, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { appDataState } = useAppDataContext();

    // state
    const [
        selectedItem,
        setSelectedItem
    ] = useState<ITargetDatabaseConnection | null>(appDataState.targetDatabase);
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
    const items: ITargetDatabaseConnection[] = useMemo(
        () => [
            {
                databaseName: 'My Estero DB'
            },
            {
                databaseName: 'Database 2'
            },
            {
                databaseName: 'Database 3'
            }
        ],
        []
    );

    // callbacks

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
            <DefaultButton
                text={t('next')}
                onClick={() =>
                    onNavigateNext({
                        targetDatabase: selectedItem
                    })
                }
                disabled={!selectedItem}
            />
        </Stack>
    );
};

export default styled<IStoreListProps, IStoreListStyleProps, IStoreListStyles>(
    StoreList,
    getStyles
);
