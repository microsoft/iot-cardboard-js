import React, { useCallback, useMemo, useState } from 'react';
import {
    DetailsList,
    IColumn,
    PrimaryButton,
    SelectionMode,
    Stack
} from '@fluentui/react';
import { ITable } from '../../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { DataPusherContext, useDataPusherContext } from '../DataPusher';
import { useTranslation } from 'react-i18next';
import { cookSource } from '../../../Services/DataPusherUtils';
import { ICookedSource } from '../../../Models/Interfaces';
import { SourceType } from '../DataPusher.types';
import CookSource from '../../CookSource/CookSource';
import { IADXConnection, ICookSource, IPIDDocument } from '../../../Models';

const Cook: React.FC = () => {
    const { selectedClusterUrl, classNames } = useDataPusherContext();

    // state
    const [selectedSourceType, setSelectedSourceType] = useState<SourceType>(
        SourceType.Timeseries
    );
    const [selectedSource, setSelectedSource] = useState<ICookSource>({
        cluster: selectedClusterUrl,
        database: null,
        table: null,
        twinIdColumn: null,
        tableType: null
    });
    const [sourceTableData, setSourceTableData] = useState<ITable>(null);
    const [cookAssets, setCookAssets] = useState<ICookedSource>(null);

    // hooks
    const { t } = useTranslation();
    const sourceTableColumns = useMemo<Array<IColumn>>(
        () =>
            sourceTableData?.Columns.map((c, idx) => ({
                key: c.columnName,
                name: c.columnName,
                minWidth: 20,
                maxWidth: 100,
                isResizable: true,
                isCollapsible: true,
                onRender: (item) => item[idx]
            })) || [],
        [sourceTableData]
    );

    // callbacks
    const handleSourceTypeChange = useCallback((sourceType: SourceType) => {
        setSelectedSourceType(sourceType);
        setCookAssets(null);
    }, []);
    const handleSourceChange = useCallback((source: ICookSource) => {
        setSelectedSource(source);
        setCookAssets(null);
    }, []);
    const handleTableDataChange = useCallback((tableData: ITable) => {
        setSourceTableData(tableData);
    }, []);
    const handleCookButtonClick = useCallback(() => {
        setCookAssets(cookSource(selectedSourceType, selectedSource));
    }, [selectedSource, selectedSourceType]);

    return (
        <div>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <CookSource
                    onSourceTypeChange={handleSourceTypeChange}
                    onSourceChange={handleSourceChange}
                    onGetTableData={handleTableDataChange}
                    isClusterVisible={false}
                    targetAdapterContext={DataPusherContext}
                />
                <PrimaryButton
                    styles={classNames.subComponentStyles.button()}
                    text={t('legionApp.dataPusher.actions.cook')}
                    disabled={
                        selectedSourceType === SourceType.Timeseries
                            ? !(selectedSource as IADXConnection).twinIdColumn
                            : !(selectedSource as IPIDDocument).pidUrl
                    }
                    onClick={handleCookButtonClick}
                />
            </Stack>
            {cookAssets && (
                <div className={classNames.informationText}>
                    <p>{`${
                        cookAssets.models.length
                    } possible models found with properties ${cookAssets.models
                        .map((model) => {
                            return `[${model.propertyIds
                                .map(
                                    (propId) =>
                                        cookAssets.properties.find(
                                            (p) => p.id === propId
                                        ).name
                                )
                                .join(',')}]`;
                        })
                        .join(',')}`}</p>
                    <p>{`${
                        cookAssets.properties.length
                    } unique properties found: ${cookAssets.properties
                        .map((p) => p.name)
                        .join(',')}`}</p>
                    <p>{`${
                        cookAssets.twins.length
                    } unique twins found: ${cookAssets.twins
                        .map((t) => t.id)
                        .join(',')}`}</p>
                </div>
            )}
            <div className={classNames.tableContainer}>
                {sourceTableData?.Rows.length > 0 && (
                    <DetailsList
                        items={sourceTableData.Rows}
                        columns={sourceTableColumns}
                        isHeaderVisible={true}
                        selectionMode={SelectionMode.none}
                    />
                )}
            </div>
        </div>
    );
};

export default Cook;
