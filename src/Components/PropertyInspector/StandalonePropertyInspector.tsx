import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { DTwin, DTwinUpdateEvent } from '../../Models/Constants/Interfaces';
import './StandalonePropertyInspector.scss';

interface StandalonePropertyInspectorProps {
    twin: DTwin;
    model: DtdlInterface;
    onCommitChanges?: (patch: DTwinUpdateEvent) => any;
}

// Build up patch array -- single source of truth for patches -- push to or update existing when user changes form fields
/*
        [
            {
                "op": "replace",
                "path": "/property1",
                "value": 1
            },
            {
                "op": "add",
                "path": "/property2/subProperty1",
                "value": 1
            },
            {
                "op": "remove",
                "path": "/property3"
            }
        ]
    */

// -------- BEGIN WITH PRIMITIVE PROPERTIES ---------
/*

    -- Primitive schemas --
    boolean
    date
    dateTime
    double
    duration
    float
    integer
    long
    string
    time

    Active - properties currently set on the twin, must be mapped onto active list
    Inactive - properties that can be added to the twin
    
    {
        active: [
            {
                name: "InFlow"
                schema: "double",
                value: 5.23
            }
        ]
        inactive: [
            {
                name: "Temperature"
                schema: "double",
                value: null
            }
        ]
    }

*/

const StandalonePropertyInspector: React.FC<StandalonePropertyInspectorProps> = ({
    twin,
    model,
    onCommitChanges = () => null
}) => {
    console.log('Twin: ', twin);
    console.log('Model: ', model);

    // const getInitialPropertyObject = () => {
    //     const initialPropertyObject = { active: [], inactive: [] };

    //     const allPrimitiveProperties = model.properties.filter(
    //         (p) =>
    //             typeof p.schema === 'string' &&
    //             primitiveSchemas.includes(p.schema)
    //     );

    //     // Map current twin values onto model schema form (populate)
    //     allPrimitiveProperties.forEach((p) => {
    //         if (p.name in twin) {
    //             initialPropertyObject.active.push({
    //                 ...p,
    //                 value: twin[p.name]
    //             });
    //         } else {
    //             initialPropertyObject.inactive.push(p);
    //         }
    //     });

    //     return initialPropertyObject;
    // };

    const [properties, setProperties] = useState(null);

    /*
        -- Complex schemas v hard woah TODO --
        enum
        array --> can contain array, enum, map, or object (recursive) 
        map --> can contain array, enum, map, or object (recursive)
        object --> can contain array, enum, map, or object (recursive)
    */

    // Show readonly elements for "$dtId", "$etag", "$metadata", "telemetry", (possibly more)

    // On save, send patch updates to ADT API and show updated result

    return (
        <div className="cb-standalone-property-inspector-container">
            <h1>{twin['$dtId']}</h1>
        </div>
    );
};

export default StandalonePropertyInspector;
