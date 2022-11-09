import { Node, Edge } from 'react-flow-renderer';
import {
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
    OAT_GRAPH_RELATIONSHIP_NODE_TYPE,
    OAT_INTERFACE_TYPE,
    OAT_RELATIONSHIP_HANDLE_NAME,
    OAT_UNTARGETED_RELATIONSHIP_NAME
} from '../../../Models/Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship
} from '../../../Models/Constants/dtdlInterfaces';
import { getDebugLogger } from '../../../Models/Services/Utils';
import {
    IOATModelPosition,
    IOATSelection
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { ElementEdge } from './Classes/ElementEdge';
import { ElementNode } from './Classes/ElementNode';
import { ElementPosition } from './Classes/ElementPosition';

const debugLogging = true;
const logDebugConsole = getDebugLogger('OatGraphViewerUtils', debugLogging);

export const CONTEXT_CLASS_BASE = 'dtmi:dtdl:context;2';
export const DEFAULT_NODE_POSITION = 25;

const getNextRelationshipIndex = (
    _sourceId: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    let relationshipIndex = 0;
    while (
        elements.some(
            (element) =>
                // TODO: reenable this. Turned it off for now because the parser needs them to be unique across all the models (which isn't supposed to be the case)
                // (element as ElementEdge).source === sourceId &&
                (element.data as DtdlRelationship).name ===
                `${OAT_GRAPH_RELATIONSHIP_NODE_TYPE}_${relationshipIndex}`
        )
    ) {
        relationshipIndex++;
    }
    return relationshipIndex;
};

// const getNextComponentIndex = (
//     sourceId: string,
//     targetName: string,
//     elements: (ElementNode | ElementEdge)[]
// ) => {
//     let componentIndex = 0;
//     const match = elements.find((element) => element.id === sourceId);
//     if (match) {
//         const int = match.data as DtdlInterface;
//         while (
//             int &&
//             int.contents.some(
//                 (content) =>
//                     content['schema'] &&
//                     content.name === `${targetName}_${componentIndex}`
//             )
//         ) {
//             componentIndex++;
//         }
//     }
//     return componentIndex;
// };

export const addTargetedRelationship = (
    sourceId: string,
    relationship: DtdlInterfaceContent,
    elements: (ElementNode | ElementEdge)[]
) => {
    // logDebugConsole(
    //     'debug',
    //     '[START] addTargetedRelationship. {source, relationship, elements}',
    //     sourceId,
    //     relationship,
    //     elements
    // );
    const nextRelIndex = getNextRelationshipIndex(sourceId, elements);
    const name =
        relationship.name || `${OAT_RELATIONSHIP_HANDLE_NAME}_${nextRelIndex}`;
    const id = relationship['@id'] || `${sourceId}_${name}`;
    const relationshipEdge = new ElementEdge(
        id,
        '',
        OAT_GRAPH_RELATIONSHIP_NODE_TYPE,
        '',
        sourceId,
        OAT_RELATIONSHIP_HANDLE_NAME,
        relationship['target'],
        OAT_RELATIONSHIP_HANDLE_NAME,
        {
            ...relationship,
            '@type': OAT_RELATIONSHIP_HANDLE_NAME,
            name
        }
    );

    elements.push(relationshipEdge);
    // logDebugConsole(
    //     'debug',
    //     '[END] addTargetedRelationship. {elements}',
    //     elements
    // );
    return relationshipEdge;
};

export const addUntargetedRelationship = (
    sourceId: string,
    relationship: DtdlInterfaceContent,
    modelPositions: IOATModelPosition[],
    elements: (ElementNode | ElementEdge)[]
) => {
    logDebugConsole(
        'debug',
        '[START] addUntargetedRelationship. {source, relationship, positions, elements}',
        sourceId,
        relationship,
        modelPositions,
        elements
    );
    const nextRelIndex = getNextRelationshipIndex(sourceId, elements);
    const name =
        relationship.name || `${OAT_RELATIONSHIP_HANDLE_NAME}_${nextRelIndex}`;
    const id = relationship['@id'] || `${sourceId}_${name}`;
    const rp = modelPositions.find((x) => x['@id'] === id);
    const newNode = new ElementNode(
        id,
        OAT_INTERFACE_TYPE,
        {
            x: rp ? rp.position.x : DEFAULT_NODE_POSITION,
            y: rp ? rp.position.y : DEFAULT_NODE_POSITION
        },
        {
            '@id': sourceId,
            '@type': OAT_UNTARGETED_RELATIONSHIP_NAME,
            '@context': CONTEXT_CLASS_BASE,
            displayName: '',
            contents: []
        }
    );
    const relationshipEdge = new ElementEdge(
        id,
        '',
        OAT_GRAPH_RELATIONSHIP_NODE_TYPE,
        '',
        sourceId,
        OAT_UNTARGETED_RELATIONSHIP_NAME,
        id,
        OAT_UNTARGETED_RELATIONSHIP_NAME,
        {
            ...relationship,
            '@id': id,
            '@type': OAT_UNTARGETED_RELATIONSHIP_NAME,
            name: name
        }
    );

    elements.push(newNode);
    elements.push(relationshipEdge);
    logDebugConsole(
        'debug',
        '[END] addUntargetedRelationship. {elements}',
        elements
    );
    return relationshipEdge;
};

export const addComponentRelationship = (
    sourceId: string,
    component: DtdlInterfaceContent,
    targetName: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    logDebugConsole(
        'debug',
        '[START] addComponentRelationship. {source, component, elements}',
        sourceId,
        component,
        elements
    );
    // const nextComIndex = getNextComponentIndex(sourceId, targetName, elements);
    const name = component.name; // || `${targetName}_${nextComIndex}`;
    const relationshipEdge = new ElementEdge(
        `${sourceId}${OAT_COMPONENT_HANDLE_NAME}${component.schema}${name}`,
        '',
        OAT_GRAPH_RELATIONSHIP_NODE_TYPE,
        '',
        sourceId,
        OAT_COMPONENT_HANDLE_NAME,
        component.schema as string,
        OAT_COMPONENT_HANDLE_NAME,
        {
            ...component,
            '@type': OAT_COMPONENT_HANDLE_NAME,
            name
        }
    );

    elements.push(relationshipEdge);
    logDebugConsole(
        'debug',
        '[END] addComponentRelationship. {edge, elements}',
        relationshipEdge,
        elements
    );
    return relationshipEdge;
};

export const addExtendsRelationship = (
    sourceId: string,
    extend: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    // logDebugConsole(
    //     'debug',
    //     '[START] addExtendsRelationship. {source, extend, elements}',
    //     sourceId,
    //     extend,
    //     elements
    // );
    const relationshipEdge = new ElementEdge(
        `${sourceId}${OAT_EXTEND_HANDLE_NAME}${extend}`,
        '',
        OAT_GRAPH_RELATIONSHIP_NODE_TYPE,
        '',
        sourceId,
        OAT_EXTEND_HANDLE_NAME,
        extend,
        OAT_EXTEND_HANDLE_NAME,
        {
            '@id': `${sourceId}${OAT_EXTEND_HANDLE_NAME}${extend}`,
            '@type': OAT_EXTEND_HANDLE_NAME,
            name: ''
        }
    );
    elements.push(relationshipEdge);
    // logDebugConsole(
    //     'debug',
    //     '[END] addExtendsRelationship. {elements}',
    //     elements
    // );
    return relationshipEdge;
};

/**
 * Adds a node to the graph with the given model data
 * @param model model to bind to the new node
 * @param position position of the new node
 * @param elements collection of existing elements
 * @returns new node that was added
 */
export const addModelToGraph = (
    model: DtdlInterface,
    position: ElementPosition,
    elements: (ElementNode | ElementEdge)[]
) => {
    const newNode = new ElementNode(
        model['@id'],
        OAT_INTERFACE_TYPE,
        position,
        model
    );
    elements.push(newNode);
    return newNode;
};

/**
 * Removes a node to the graph with the given model data
 * @param model model to remove from the graph
 * @param elements collection of existing elements, will be updated in place
 * @returns the updated list of elements
 */
export const deleteModelFromGraph = (
    model: DtdlInterface,
    elements: (ElementNode | ElementEdge)[]
) => {
    const index = elements.findIndex((x) => x.id === model['@id']);
    if (index >= 0) {
        elements.splice(index, 1);
    }
    return elements;
};

/**
 * Finds a node in the graph for a model and updates the data to match the latest data
 * @param oldId previous id
 * @param newModel new model data
 * @param elements existing graph nodes, updated in-place
 * @returns the updated graph nodes
 */
export const updateModelInGraph = (
    oldId: string,
    newModel: DtdlInterface,
    elements: (ElementNode | ElementEdge)[]
) => {
    // find an update the node itself
    const existingNode = elements.find((x) => x.id === oldId);
    if (existingNode) {
        existingNode.id = newModel['@id'];
        existingNode.data = newModel;
    } else {
        logDebugConsole(
            'warn',
            'Could not find the node in the graph to update. {oldId, newModel, elements}',
            oldId,
            newModel,
            elements
        );
    }
    // grab relationships pointing to/from this node
    const existingRelationships = elements.filter(
        (x: ElementEdge) =>
            x.type === OAT_GRAPH_RELATIONSHIP_NODE_TYPE &&
            (x.source === oldId || x.target === oldId)
    );
    if (existingRelationships?.length) {
        // update all those existing relationships for this node
        existingRelationships.forEach((x: ElementEdge) => {
            // update the id to replace the old id with the new one
            x.id = x.id.replace(oldId, existingNode.id);
            if (x.source === oldId) {
                // update the source to be the new id
                x.source = existingNode.id;
            }
            if (x.target === oldId) {
                // update the target to be the new id
                x.target = existingNode.id;
            }
        });
    }

    return elements;
};

export const getSelectionIdentifier = (
    data: DtdlRelationship | DtdlInterfaceContent
) => {
    switch (data['@type']) {
        case OAT_EXTEND_HANDLE_NAME:
            return data['@id'];
        default:
            return data.name;
    }
};

export const getSelectionFromNode = (
    node: Node<any> | Edge<any>
): IOATSelection => {
    const edge = node as ElementEdge;
    if (edge.source) {
        return {
            modelId: edge.source,
            contentId: getSelectionIdentifier(edge.data)
        };
    }

    return { modelId: node.id };
};
