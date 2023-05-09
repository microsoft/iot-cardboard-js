import React, { useMemo } from 'react';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { IDiagramTabProps } from './DiagramTab.types';
import { useClassNames } from './DiagramTab.styles';
import { useEntities } from '../../../../../../Hooks/useEntities';
import { Kind } from '../../../../../../Models';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DiagramTab', debugLogging);

const DiagramTab: React.FC<IDiagramTabProps> = (_props) => {
    // contexts

    // state

    // hooks
    const { entities } = useEntities();
    const diagrams = useMemo(
        () => entities.filter((e) => e.type.kind === Kind.PID),
        [entities]
    );

    // callbacks

    // side effects

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <ul></ul>
            {diagrams.map((d) => (
                <li>{JSON.stringify(d.values)}</li>
            ))}
        </div>
    );
};

export default DiagramTab;
