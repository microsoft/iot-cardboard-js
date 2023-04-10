import { getDebugLogger } from '../../../Models/Services/Utils';
import { ITargetDatabaseConnection } from '../Contexts/AppDataContext/AppDataContext.types';
import { LOCAL_STORAGE_KEYS } from '../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('LocalStorageManager', debugLogging);

class LocalStorageManager {
    static GetTargetGraphStores(): ITargetDatabaseConnection[] {
        const storageData = localStorage.getItem(
            LOCAL_STORAGE_KEYS.StoreList.existingTargetDatabases
        );
        if (storageData) {
            const data =
                (JSON.parse(storageData) as ITargetDatabaseConnection[]) || [];
            logDebugConsole(
                'info',
                'Getting graph list from storage {list}',
                data
            );
            return data;
        }
            logDebugConsole(
                'info',
                'Graph list not found in storage, using []'
            );
        return [];
    }
    static AddTargetGraphStore(graph: ITargetDatabaseConnection): boolean {
        if (graph) {
            const existingGraphs = this.GetTargetGraphStores();
            const newGraphList = [...existingGraphs, graph];
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.StoreList.existingTargetDatabases,
                JSON.stringify(newGraphList)
            );
            logDebugConsole(
                'info',
                'Added new graph to storage {graph, list}',
                graph,
                newGraphList
            );
        }
        return !!graph;
    }
}

export default LocalStorageManager;
