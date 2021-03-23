import { useEffect, useRef } from 'react';
import { ITSIHierarchyComponentProps } from '../Constants';
import useGuid from './useGuid';

const useTSIHierarchyComponentRender = (
    component,
    renderParameters: ITSIHierarchyComponentProps
) => {
    const hierarchyContainerGUID = useGuid();
    const hierarchy = useRef(null);

    useEffect(() => {
        if (hierarchy.current === null) {
            hierarchy.current = new component(
                document.getElementById(hierarchyContainerGUID)
            );
        }
        if (renderParameters.environmentFqdn) {
            hierarchy.current.render(
                renderParameters.environmentFqdn,
                renderParameters.getToken,
                renderParameters.hierarchyNavOptions
            );
        }
    }, [renderParameters]);

    return hierarchyContainerGUID;
};

export default useTSIHierarchyComponentRender;
