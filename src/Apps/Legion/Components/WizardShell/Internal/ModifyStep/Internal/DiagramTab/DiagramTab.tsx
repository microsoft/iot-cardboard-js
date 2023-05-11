import React, { useMemo } from 'react';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { IDiagramTabProps } from './DiagramTab.types';
import { useClassNames } from './DiagramTab.styles';
import { useEntities } from '../../../../../../Hooks/useEntities';
import { Kind } from '../../../../../../Models';
import Diagram from '../../../../../Diagram/Diagram';
import { IDiagramAnnotations } from '../../../../../Diagram/Diagram.types';
import { PIDSourceUrlsToImgUrlMapping } from '../../../../../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DiagramTab', debugLogging);

const DiagramTab: React.FC<IDiagramTabProps> = (_props) => {
    // contexts

    // state

    // hooks
    const { entities } = useEntities();
    const newDiagramEntities = useMemo(
        () => entities.filter((e) => e.type.kind === Kind.PID),
        [entities]
    );
    const annotations: Array<IDiagramAnnotations> = useMemo(
        () =>
            newDiagramEntities.map((e) => ({
                friendlyName: e.friendlyName,
                type: e.type,
                values: e.values,
                isNew: e.isNew
            })),
        [newDiagramEntities]
    );

    // callbacks

    // side effects

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Diagram
                imageUrl={
                    PIDSourceUrlsToImgUrlMapping[
                        newDiagramEntities[0].sourceConnectionString
                    ]
                }
                annotations={annotations}
            />
        </div>
    );
};

export default DiagramTab;
