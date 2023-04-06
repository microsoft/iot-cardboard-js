import React, { useState } from 'react';
import {
    classNamesFunction,
    DetailsList,
    IColumn,
    SelectionMode,
    Selection,
    styled,
    Stack,
    DefaultButton
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IStoreListProps,
    IStoreListStyleProps,
    IStoreListStyles
} from './StoreList.types';
import { getStyles } from './StoreList.styles';
import {
    AppDataContextActionType,
    ITargetDatabaseConnection
} from '../../Contexts/AppDataContext/AppDataContext.types';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';
import { useNavigationContext } from '../../Contexts/NavigationContext/NavigationContext';
import { NavigationContextActionType } from '../../Contexts/NavigationContext/NavigationContext.types';

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
    const { styles } = props;

    // contexts
    const { AppDataState, AppDataDispatch } = useAppDataContext();
    const { navigationDispatch } = useNavigationContext();

    // state
    const [
        selectedItem,
        setSelectedItem
    ] = useState<ITargetDatabaseConnection | null>(null);

    // hooks

    // data
    const items: ITargetDatabaseConnection[] = [
        {
            databaseName: 'My Estero DB'
        },
        {
            databaseName: 'Database 2'
        },
        {
            databaseName: 'Database 3'
        }
    ];

    // callbacks
    const selection = new Selection({
        onSelectionChanged: () => {
            // getSelection returns an array of selected elements, since this is single select first one is always going to be the correct one
            const selectionValue = selection.getSelection()[0];
            console.log('***Selected', selectionValue);
            setSelectedItem(
                selectionValue ? selectionValue['databaseName'] : null
            );
        }
    });

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <Stack className={classNames.root}>
            <DetailsList
                items={items}
                columns={columns}
                selectionMode={SelectionMode.single}
                selection={selection}
                selectionPreservedOnEmptyClick={true}
            />
            <DefaultButton
                text={'next'}
                onClick={() => {
                    AppDataDispatch({
                        type: AppDataContextActionType.SET_TARGET_DATABASE,
                        payload: {
                            targetDatabase: selectedItem
                        }
                    });
                    navigationDispatch({
                        type: NavigationContextActionType.NAVIGATE_TO,
                        payload: {
                            pageName: 'ActionPicker'
                        }
                    });
                }}
                disabled={!AppDataState.targetDatabase}
            />
        </Stack>
    );
};

export default styled<IStoreListProps, IStoreListStyleProps, IStoreListStyles>(
    StoreList,
    getStyles
);
