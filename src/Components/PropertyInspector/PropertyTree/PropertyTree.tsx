import React, { createContext } from 'react';
import { TreeProps, PropertyTreeProps } from './PropertyTree.types';
import './PropertyTree.scss';
import TreeNode from './TreeComponents/TreeNode';
import { LOCAL_STORAGE_KEYS } from '../../../Models/Constants/Constants';
import DataHistoryExplorerModalControl from '../../DataHistoryExplorerModal/DataHistoryExplorerModalControl/DataHistoryExplorerModalControl';

export const PropertyTreeContext = createContext<
    Omit<PropertyTreeProps, 'data'>
>(null);

const isDataHistoryFeatureEnabled =
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.DataHistoryExplorer.showExplorer
    ) === 'true';

const PropertyTree: React.FC<PropertyTreeProps> = ({
    data,
    isTreeEdited,
    onParentClick,
    onNodeValueChange,
    onNodeValueUnset,
    onAddMapValue,
    onRemoveMapValue,
    onAddArrayItem,
    onRemoveArrayItem,
    onClearArray,
    readonly = false,
    isWithDataHistory
}) => {
    return (
        <PropertyTreeContext.Provider
            value={{
                isTreeEdited,
                onParentClick,
                onNodeValueChange,
                onNodeValueUnset,
                onAddMapValue,
                onRemoveMapValue,
                onAddArrayItem,
                onRemoveArrayItem,
                onClearArray,
                readonly
            }}
        >
            <div className="cb-property-tree-container">
                {isDataHistoryFeatureEnabled && !!isWithDataHistory && (
                    <DataHistoryExplorerModalControl
                        styles={{
                            root: { position: 'absolute', right: 0, top: -4 } // will keep the styling here hardcoded until we refactor the styling change for this component
                        }}
                        adapter={isWithDataHistory.adapter}
                        isEnabled={isWithDataHistory.isEnabled}
                        initialTwinId={isWithDataHistory.twinId}
                    />
                )}
                <Tree data={data} />
            </div>
        </PropertyTreeContext.Provider>
    );
};

export const Tree: React.FC<TreeProps> = ({ data, isChildTree = false }) => {
    return (
        <ul
            className={`cb-property-tree-list-group${
                isChildTree ? ' cb-is-child-tree' : ''
            }`}
        >
            {data.map((node) => {
                return (
                    <li className="cb-property-tree-list-item" key={node.path}>
                        <TreeNode node={node} />
                    </li>
                );
            })}
        </ul>
    );
};

export default PropertyTree;
