import React, { useState } from 'react';
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
        const [isLoading, setIsLoading] = useState(false);

        return node.nodeType === HierarchyNodeType.Parent ? (
            <>
                <div className="cb-hierarchy-node">
                    <Chevron collapsed={node.isCollapsed} />
                    <span
                        className={
                            'cb-hierarchy-node-name cb-hierarchy-parent-node'
                        }
                        onClick={() => {
                            if (onParentNodeClick) {
                                onParentNodeClick(node);
                            }
                        }}
                    >
                        {node.name}
                        {Object.keys(node.children).length > 0 && (
                            <span className="cb-hierarchy-child-count">
                                {Object.keys(node.children).length -
                                    (node.childrenContinuationToken ? 1 : 0)}
                            </span>
                        )}
                    </span>
                </div>
                {!node.isCollapsed && <Tree data={node.children} />}
            </>
        ) : (
            <>
                <div className="cb-hierarchy-node">
                    <span
                        className={`cb-hierarchy-node-name cb-hierarchy-child-node ${
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
                                    setIsLoading(true);
                                }
                                setTimeout(() => {
                                    node.onNodeClick(node);
                                }, 1000);
                            } else if (onChildNodeClick) {
                                onChildNodeClick(node.parentNode, node);
                            }
                        }}
                    >
                        {isLoading ? (
                            <Spinner size={SpinnerSize.xSmall} />
                        ) : (
                            node.name
                        )}
                    </span>
                </div>
            </>
        );
    };

    const Tree: React.FC<IHierarchyProps> = ({ data }) => {
        return (
            <ul className="cb-hierarchy-component-list-group">
                {Object.keys(data).map((nodeId: string, idx: number) => (
                    <li
                        className="cb-hierarchy-node-wrapper"
                        key={'cb-hierarchy-node' + idx}
                    >
                        <TreeNode node={data[nodeId]} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="cb-hierarchy-component-wrapper">
            <div className={'cb-hierarchy-component'}>
                <Tree data={data} />
            </div>
        </div>
    );
};

export default React.memo(Hierarchy);
