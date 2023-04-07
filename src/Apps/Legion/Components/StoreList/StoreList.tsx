import React, { useRef, useState } from 'react';
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
import { useAppNavigationContext } from '../../Contexts/NavigationContext/AppNavigationContext';
import {
    AppNavigationContextActionType,
    AppPageName
} from '../../Contexts/NavigationContext/AppNavigationContext.types';

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
    const { appNavigationDispatch } = useAppNavigationContext();

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
    const selection = useRef<Selection>(
        new Selection({
            onSelectionChanged: () => {
                // getSelection returns an array of selected elements, since this is single select first one is always going to be the correct one
                const selectionValue = selection.current.getSelection()[0];
                console.log('***Selected', selectionValue);
                setSelectedItem(
                    selectionValue ? selectionValue['databaseName'] : null
                );
            }
        })
    );

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
                selection={selection.current}
                selectionPreservedOnEmptyClick={true}
            />
            <DefaultButton
                text={'next'}
                onClick={() => {
                    AppDataDispatch({
                        type: AppDataContextActionType.SET_TARGET_DATABASE,
                        payload: {
                            targetDatabase: {
                                databaseName: 'My Estero DB'
                            } // selectedItem
                        }
                    });
                    appNavigationDispatch({
                        type: AppNavigationContextActionType.NAVIGATE_TO,
                        payload: {
                            pageName: AppPageName.FlowPicker
                        }
                    });
                }}
                // disabled={!AppDataState.targetDatabase}
            />
        </Stack>
    );
};

export default styled<IStoreListProps, IStoreListStyleProps, IStoreListStyles>(
    StoreList,
    getStyles
);
