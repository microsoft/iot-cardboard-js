import React from 'react';
import {
    HierarchyNodeType,
    IHierarchyNode,
    IHierarchyProps
} from '../../Models/Constants';
import './Hierarchy.scss';
import { Icon } from '@fluentui/react/lib/Icon';
import { Spinner, SpinnerSize } from '@fluentui/react';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const Chevron = ({ collapsed }) => (
        <Icon
            iconName={'ChevronRight'}
            className={`cb-chevron ${
                collapsed ? 'cb-collapsed' : 'cb-expanded'
            }`}
        />
    );

    const TreeNode: React.FC<{ node: IHierarchyNode }> = ({ node }) => {
        return node.nodeType === HierarchyNodeType.Parent ? (
            <>
                <div className="cb-hierarchy-node">
                    <Chevron collapsed={node.isCollapsed} />
                    <div
                        className={
                            'cb-hierarchy-node-name-wrapper cb-hierarchy-parent-node'
                        }
                        onClick={() => {
                            if (onParentNodeClick) {
                                onParentNodeClick(node);
                            }
                        }}
                    >
                        <span className="cb-hierarchy-node-name">
                            {node.name}
                        </span>
                        {Object.keys(node.children).length > 0 && (
                            <span className="cb-hierarchy-child-count">
                                {Object.keys(node.children).length -
                                    (node.childrenContinuationToken ? 1 : 0)}
                            </span>
                        )}
                        {node.isLoading && (
                            <Spinner size={SpinnerSize.xSmall} />
                        )}
                    </div>
                </div>
                {!node.isCollapsed && <Tree data={node.children} />}
            </>
        ) : (
            <>
                <div className="cb-hierarchy-node">
                    <div
                        className={`cb-hierarchy-node-name-wrapper cb-hierarchy-child-node ${
                            node.isSelected ? 'cb-selected' : ''
                        } ${
                            node.nodeType === HierarchyNodeType.ShowMore
                                ? 'cb-hierarchy-show-more'
                                : ''
                        }`}
                        onClick={() => {
                            if (node.onNodeClick) {
                                if (
                                    node.nodeType === HierarchyNodeType.ShowMore
                                ) {
                                    node.onNodeClick(node);
                                }
                            } else if (onChildNodeClick) {
                                onChildNodeClick(node.parentNode, node);
                            }
                        }}
                    >
                        {node.isLoading ? (
                            <Spinner size={SpinnerSize.xSmall} />
                        ) : (
                            <span className="cb-hierarchy-node-name">
                                {node.name}
                            </span>
                        )}
                    </div>
                </div>
            </>
        );
    };
    const MemoizedTreeNode = React.memo(TreeNode);

    const Tree: React.FC<IHierarchyProps> = ({ data }) => {
        return (
            <ul className="cb-hierarchy-component-list-group">
                {Object.keys(data).map((nodeId: string, idx: number) => (
                    <li
                        className="cb-hierarchy-node-wrapper"
                        key={'cb-hierarchy-node' + idx}
                    >
                        <MemoizedTreeNode node={data[nodeId]} />
                    </li>
                ))}
            </ul>
        );
    };
    const MemoizedTree = React.memo(Tree);

    return (
        <div className="cb-hierarchy-component-wrapper">
            <div className={'cb-hierarchy-component'}>
                <MemoizedTree data={data} />
            </div>
        </div>
    );
};

export default React.memo(Hierarchy);
