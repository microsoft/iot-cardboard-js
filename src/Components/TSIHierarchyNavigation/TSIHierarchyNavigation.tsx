import React from 'react';
import ClientHierarchyNavigation from 'tsiclient/HierarchyNavigation';
import 'tsiclient/tsiclient.css';
import { ITSIHierarchyComponentProps } from '../../Models/Constants';
import useTSIHierarchyComponentRender from '../../Models/Hooks/useRenderTSIHierarchyComponent';

const TSIHierarchyNavigation: React.FC<ITSIHierarchyComponentProps> = ({
    environmentFqdn,
    getToken,
    hierarchyNavOptions
}) => {
    const chartContainerGUID = useTSIHierarchyComponentRender(
        ClientHierarchyNavigation,
        {
            environmentFqdn,
            getToken,
            hierarchyNavOptions
        }
    );
    return (
        <div
            className="cb-tsicomponent-container"
            id={chartContainerGUID}
        ></div>
    );
};

export default React.memo(TSIHierarchyNavigation);
