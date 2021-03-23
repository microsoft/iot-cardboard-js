import React from 'react';
import { IHierarchyNode, IHierarchyProps } from '../../Models/Constants';
import './Hierarchy.scss';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const renderTree = (data: Record<string, IHierarchyNode>) => (
        <ul className="cb-hierarchy-component-list-group">
            {Object.keys(data).map((nodeName: string, idx: number) => (
                <li
                    className="cb-hierarchy-node-wrapper"
                    key={'cb-hierarchy' + idx}
                >
                    {data[nodeName].children ? (
                        <>
                            <div className="cb-hierarchy-node">
                                <span
                                    className={`cb-carot ${
                                        data[nodeName].isCollapsed
                                            ? 'cb-carot-collapsed'
                                            : 'cb-carot-expanded'
                                    }`}
                                />
                                <span
                                    className={
                                        'cb-hierarchy-node-name cb-hierarchy-parent-node'
                                    }
                                    onClick={() => {
                                        if (onParentNodeClick) {
                                            onParentNodeClick(data[nodeName]);
                                        }
                                    }}
                                >
                                    {nodeName}
                                    {Object.keys(data[nodeName].children)
                                        .length > 0 && (
                                        <span className="cb-hierarchy-child-count">
                                            {
                                                Object.keys(
                                                    data[nodeName].children
                                                ).length
                                            }
                                        </span>
                                    )}
                                </span>
                            </div>
                            {!data[nodeName].isCollapsed &&
                                renderTree(data[nodeName].children)}
                        </>
                    ) : (
                        <div className="cb-hierarchy-node">
                            <span
                                className={
                                    'cb-hierarchy-node-name cb-hierarchy-child-node'
                                }
                                onClick={() => {
                                    if (onChildNodeClick) {
                                        onChildNodeClick(
                                            data[nodeName].parentId,
                                            data[nodeName]
                                        );
                                    }
                                }}
                            >
                                {nodeName}
                            </span>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="cb-hierarchy-component-wrapper">
            <div className={'cb-hierarchy-component'}>{renderTree(data)}</div>
        </div>
    );
};

export default React.memo(Hierarchy);
