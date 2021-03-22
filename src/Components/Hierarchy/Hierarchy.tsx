import React, { useRef } from 'react';
import { IHierarchyNode, IHierarchyProps } from '../../Models/Constants';
import './Hierarchy.scss';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const hierarchyElem = useRef(null);
    const renderTree = (data: Record<string, IHierarchyNode>) => (
        <ul className="cb-hierarchygroup">
            {Object.keys(data).map((nodeName: string, idx: number) => (
                <li className="cb-hierarchynode" key={idx}>
                    <span
                        className={
                            data[nodeName].children
                                ? 'cb-hierarchy-parentnode'
                                : 'cb-hierarchy-childnode'
                        }
                        onClick={() =>
                            data[nodeName].children
                                ? onParentNodeClick(data[nodeName])
                                : onChildNodeClick(
                                      data[nodeName].parentId,
                                      data[nodeName]
                                  )
                        }
                    >
                        {nodeName}
                    </span>
                    {data[nodeName].children &&
                        !data[nodeName].isCollapsed &&
                        renderTree(data[nodeName].children)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="cb-hierarchycomponent-container" ref={hierarchyElem}>
            <div className={'cb-hierarchycomponent'}>{renderTree(data)}</div>
        </div>
    );
};

export default React.memo(Hierarchy);
