import React, { useEffect, useRef } from 'react';
import {
    HierarchyNodeType,
    IHierarchyNode,
    IHierarchyProps
} from '../../Models/Constants';
import './Hierarchy.scss';
import { Icon, Spinner, SpinnerSize } from '@fluentui/react';
import { Utils } from '../../Models/Services';
import { useTranslation } from 'react-i18next';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    searchTermToMark,
    isLoading,
    onParentNodeClick,
    onChildNodeClick,
    noDataText,
    shouldScrollToSelectedNode
}) => {
    const { t } = useTranslation();
    const selectedNodeRef = useRef(null);

    useEffect(() => {
        if (shouldScrollToSelectedNode && selectedNodeRef.current) {
            (selectedNodeRef.current as HTMLUListElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }, [shouldScrollToSelectedNode]);

    const Chevron = ({ collapsed }) => (
        <Icon
            iconName={'ChevronRight'}
            className={`cb-chevron ${
                collapsed ? 'cb-collapsed' : 'cb-expanded'
            }`}
        />
    );

    const TreeNode: React.FC<{
        node: IHierarchyNode;
        searchTermToMark: string;
    }> = ({ node, searchTermToMark }) => {
        const formattedNodeName = () => {
            if (
                searchTermToMark &&
                node.nodeType !== HierarchyNodeType.ShowMore
            ) {
                return Utils.getMarkedHtmlBySearch(node.name, searchTermToMark);
            } else {
                return node.name;
            }
        };
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
                            {formattedNodeName()}
                        </span>
                        {node.children &&
                            Object.keys(node.children).length > 0 && (
                                <span className="cb-hierarchy-child-count">
                                    {Object.keys(node.children).length -
                                        (node.childrenContinuationToken
                                            ? 1
                                            : 0)}
                                </span>
                            )}
                        {node.isLoading && (
                            <Spinner size={SpinnerSize.xSmall} />
                        )}
                    </div>
                </div>
                {!node.isCollapsed && (
                    <MemoizedTree
                        data={node.children}
                        searchTermToMark={searchTermToMark}
                        isLoading={isLoading}
                    />
                )}
            </>
        ) : (
            <>
                <div className="cb-hierarchy-node">
                    <div
                        ref={node.isSelected ? selectedNodeRef : undefined}
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
                                {node.isNewlyAdded && (
                                    <Icon
                                        iconName={'Glimmer'}
                                        className={'cb-glimmer'}
                                    />
                                )}
                                {formattedNodeName()}
                            </span>
                        )}
                    </div>
                </div>
            </>
        );
    };
    const MemoizedTreeNode = React.memo(TreeNode);

    const Tree: React.FC<IHierarchyProps> = ({
        data,
        searchTermToMark,
        isLoading
    }) => {
        return isLoading ? (
            <Spinner size={SpinnerSize.xSmall} />
        ) : !data || Object.keys(data).length === 0 ? (
            <span className="cb-hierarchy-no-results">
                {searchTermToMark
                    ? t('noSearchResults')
                    : noDataText
                    ? noDataText
                    : t('noData')}
            </span>
        ) : (
            <ul className="cb-hierarchy-component-list-group">
                {Object.keys(data).map((nodeId: string, idx: number) => (
                    <li
                        className="cb-hierarchy-node-wrapper"
                        key={'cb-hierarchy-node' + idx}
                    >
                        <MemoizedTreeNode
                            node={data[nodeId]}
                            searchTermToMark={searchTermToMark}
                        />
                    </li>
                ))}
            </ul>
        );
    };
    const MemoizedTree = React.memo(Tree);
    return (
        <div className="cb-hierarchy-component-wrapper">
            <div className={'cb-hierarchy-component'}>
                <MemoizedTree
                    data={data}
                    searchTermToMark={searchTermToMark}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default React.memo(Hierarchy);
