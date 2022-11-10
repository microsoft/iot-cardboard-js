import React, { createContext } from 'react';
import { TreeProps, PropertyTreeProps } from './PropertyTree.types';
import './PropertyTree.scss';
import TreeNode from './TreeComponents/TreeNode';

export const PropertyTreeContext = createContext<
    Omit<PropertyTreeProps, 'data'>
>(null);

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
    readonly = false
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
