import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTwin } from '../../Models/Constants/Interfaces';
import './TwinEdit.scss';

interface TwinEditProps {
    twin: DTwin;
    model: DTDLModel;
}

const primitiveSchemas = [
    'boolean',
    'date',
    'dateTime',
    'double',
    'duration',
    'float',
    'integer',
    'long',
    'string',
    'time'
];

const TwinEdit: React.FC<TwinEditProps> = ({ twin, model }) => {
    // Possibly refactor to only take twinId, and use that to fetch twin & model from API
    console.log('Twin: ', twin);
    console.log('Model: ', model);

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

    const getInitialPropertyObject = () => {
        const initialPropertyObject = { active: [], inactive: [] };

        const allPrimitiveProperties = model.properties.filter(
            (p) =>
                typeof p.schema === 'string' &&
                primitiveSchemas.includes(p.schema)
        );

        // Map current twin values onto model schema form (populate)
        allPrimitiveProperties.forEach((p) => {
            if (p.name in twin) {
                initialPropertyObject.active.push({
                    ...p,
                    value: twin[p.name]
                });
            } else {
                initialPropertyObject.inactive.push(p);
            }
        });

        return initialPropertyObject;
    };

    const [properties, setProperties] = useState(getInitialPropertyObject());

    /*
        -- Complex schemas v hard woah TODO --
        enum
        array --> can contain array, enum, map, or object (recursive) 
        map --> can contain array, enum, map, or object (recursive)
        object --> can contain array, enum, map, or object (recursive)
    */

    // Show readonly elements for "$dtId", "$etag", "$metadata", "telemetry", (possibly more)

    // On save, send patch updates to ADT API and show updated result

    const addProperty = (name) => {
        setProperties(
            produce((draft) => {
                draft.active.push({
                    ...draft.inactive.splice(
                        draft.inactive.indexOf((p) => p.name === name),
                        1
                    )[0],
                    value: 0
                });
            })
        );
    };

    const removeProperty = (name) => {
        setProperties(
            produce((draft) => {
                draft.inactive.push(
                    draft.active.splice(
                        draft.active.indexOf((p) => p.name === name),
                        1
                    )[0]
                );
            })
        );
    };

    const handlePropertyChange = (name, newValue) => {
        setProperties(
            produce((draft) => {
                draft.active.find((p) => p.name === name).value = newValue;
            })
        );
    };

    console.log('Properties: ', properties);

    return (
        <div className="cb-edit-twin-container">
            <h1>Edit twin</h1>
            <h3>Active primitive properties</h3>
            {properties.active.map((p) => (
                <div className="cb-active-property">
                    <div className="cb-active-property-input-row">
                        <TextField
                            label={p.name}
                            value={p.value}
                            onChange={(_event, newValue) =>
                                handlePropertyChange(p.name, newValue)
                            }
                        ></TextField>
                    </div>
                    <button
                        className="cb-active-property-remove-button"
                        onClick={() => removeProperty(p.name)}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <h3>Inactive primitive properties</h3>
            {properties.inactive.map((p) => (
                <div className="cb-inactive-property">
                    <div>{p.name}</div>
                    <button onClick={() => addProperty(p.name)}>Add</button>
                </div>
            ))}
        </div>
    );
};

export default TwinEdit;
