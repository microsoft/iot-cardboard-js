import React from 'react';
import { IHierarchyNode, IHierarchyProps } from '../../Models/Constants';
import './Hierarchy.scss';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const renderTree = (data: Record<string, IHierarchyNode>) => (
        <ul className="cb-hierarchygroup">
            {Object.keys(data).map((nodeName: string, idx: number) => (
                <li
                    className="cb-hierarchynode-wrapper"
                    key={'cb-hierarchy' + idx}
                >
                    {data[nodeName].children ? (
                        <>
                            <div className="cb-hierarchynode">
                                <span
                                    className={`cb-carot ${
                                        data[nodeName].isCollapsed
                                            ? 'cb-hierarchynode-collapsed'
                                            : 'cb-hierarchynode-expanded'
                                    }`}
                                />
                                <span
                                    className={
                                        'cb-hierarchy-node-name cb-hierarchy-parentnode'
                                    }
                                    onClick={() =>
                                        onParentNodeClick(data[nodeName])
                                    }
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
                        <div className="cb-hierarchynode">
                            <span
                                className={
                                    'cb-hierarchy-node-name cb-hierarchy-childnode'
                                }
                                onClick={() =>
                                    onChildNodeClick(
                                        data[nodeName].parentId,
                                        data[nodeName]
                                    )
                                }
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
        <div className="cb-hierarchycomponent-container">
            <div className={'cb-hierarchycomponent'}>{renderTree(data)}</div>
        </div>
    );
};

export default React.memo(Hierarchy);
