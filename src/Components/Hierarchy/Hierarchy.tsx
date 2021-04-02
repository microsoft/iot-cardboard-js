import React from 'react';
import { IHierarchyProps } from '../../Models/Constants';
import './Hierarchy.scss';
import { Icon } from '@fluentui/react/lib/Icon';

const Hierarchy: React.FC<IHierarchyProps> = ({
    data,
    onParentNodeClick,
    onChildNodeClick
}) => {
    const Chevron = ({ collapsed }) => (
        <Icon
            iconName={'ChevronRight'}
            style={{
                display: 'inline-block',
                position: 'absolute',
                top: '8px',
                zIndex: 1,
                transition: 'all 0.2s ease',
                transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                fontSize: '12px'
            }}
        />
    );

    const Tree: React.FC<IHierarchyProps> = ({ data }) => {
        return (
            <ul className="cb-hierarchy-component-list-group">
                {Object.keys(data).map((nodeId: string, idx: number) => (
                    <li
                        className="cb-hierarchy-node-wrapper"
                        key={'cb-hierarchy' + idx}
                    >
                        {data[nodeId].children ? (
                            <>
                                <div className="cb-hierarchy-node">
                                    <Chevron
                                        collapsed={data[nodeId].isCollapsed}
                                    />
                                    <span
                                        className={
                                            'cb-hierarchy-node-name cb-hierarchy-parent-node'
                                        }
                                        onClick={() => {
                                            if (onParentNodeClick) {
                                                onParentNodeClick(data[nodeId]);
                                            }
                                        }}
                                    >
                                        {data[nodeId].name}
                                        {Object.keys(data[nodeId].children)
                                            .length > 0 && (
                                            <span className="cb-hierarchy-child-count">
                                                {
                                                    Object.keys(
                                                        data[nodeId].children
                                                    ).length
                                                }
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {!data[nodeId].isCollapsed && (
                                    <Tree data={data[nodeId].children} />
                                )}
                            </>
                        ) : (
                            <div className="cb-hierarchy-node">
                                <span
                                    className={`cb-hierarchy-node-name cb-hierarchy-child-node ${
                                        data[nodeId].isSelected
                                            ? 'cb-selected'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        if (onChildNodeClick) {
                                            onChildNodeClick(
                                                data[nodeId].parentNode,
                                                data[nodeId]
                                            );
                                        }
                                    }}
                                >
                                    {data[nodeId].name}
                                </span>
                            </div>
                        )}
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
