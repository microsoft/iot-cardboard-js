import React from 'react';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { ITypesTabProps } from './TypesTab.types';
import { getStyles } from './TypesTab.styles';
import { useTypes } from '../../../../../../Hooks/useTypes';
import TypesCard from './Internal/TypesCard/TypesCard';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TypesTab', debugLogging);

const TypesTab: React.FC<ITypesTabProps> = (_props) => {
    const { types } = useTypes();
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getStyles();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            {types.map((type, idx) => {
                return <TypesCard key={`${type.id}-${idx}`} typeId={type.id} />;
            })}
        </div>
    );
};

export default TypesTab;
