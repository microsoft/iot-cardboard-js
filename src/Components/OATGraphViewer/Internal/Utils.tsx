import { Node, Edge } from 'react-flow-renderer';
import {
    IOATNodePosition,
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

const debugLogging = false;
const logDebugConsole = getDebugLogger('OatGraphViewerUtils', debugLogging);

export const CONTEXT_CLASS_BASE = 'dtmi:dtdl:context;2';
export const DEFAULT_NODE_POSITION = 25;

//#region Add relationships

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
    const name = relationship.name;
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
    sourceModel: DtdlInterface,
    relationship: DtdlInterfaceContent,
    modelPositions: IOATModelPosition[],
    elements: (ElementNode | ElementEdge)[]
) => {
    logDebugConsole(
        'debug',
        '[START] addUntargetedRelationship. {source, relationship, positions, elements}',
        sourceModel['@id'],
        relationship,
        modelPositions,
        elements
    );
    const name = relationship.name;
    const id =
        relationship['@id'] || // use the given id if present
        `untargeted_${sourceModel['@id']}_${relationship.name}`; // generate a name from the relationship name
    const rp = modelPositions.find((x) => x['@id'] === id);
    const newNode = new ElementNode(
        id, // id
        OAT_INTERFACE_TYPE, // type
        {
            x: rp ? rp.position.x : DEFAULT_NODE_POSITION,
            y: rp ? rp.position.y : DEFAULT_NODE_POSITION
        }, // position
        {
            '@id': sourceModel['@id'],
            '@type': OAT_UNTARGETED_RELATIONSHIP_NAME,
            '@context': CONTEXT_CLASS_BASE,
            displayName: '',
            contents: []
        } // data
    );
    const relationshipEdge = new ElementEdge(
        id, // id
        '', // label
        OAT_GRAPH_RELATIONSHIP_NODE_TYPE, // type
        '', // marker end
        sourceModel['@id'], // source
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
        '[END] addUntargetedRelationship. {node, edge, elements}',
        newNode,
        relationshipEdge,
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
    // logDebugConsole(
    //     'debug',
    //     '[START] addComponentRelationship. {source, component, elements}',
    //     sourceId,
    //     component,
    //     elements
    // );
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
    // logDebugConsole(
    //     'debug',
    //     '[END] addComponentRelationship. {edge, elements}',
    //     relationshipEdge,
    //     elements
    // );
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

//#endregion

//#region Add/remove/edit models

/**
 * Adds a node to the graph with the given model data
 * @param model model to bind to the new node
 * @param position position of the new node
 * @param elements collection of existing elements
 * @returns new node that was added
 */
export const addModelToGraph = (
    model: DtdlInterface,
    position: ElementPosition | undefined,
    elements: (ElementNode | ElementEdge)[]
) => {
    const newNode = new ElementNode(
        model['@id'],
        OAT_INTERFACE_TYPE,
        position || {
            x: DEFAULT_NODE_POSITION,
            y: DEFAULT_NODE_POSITION
        },
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

//#endregion

const NEW_NODE_OFFSET = 15;
/**
 * Gets the position of a node such that it does not sit directly on top of any other node.
 * @param coordinates Coordinates to check to see if they are available
 * @param positions positions of existing models on the graph
 * @returns
 */
export const getNewNodePosition = (
    coordinates: IOATNodePosition,
    positions: IOATModelPosition[]
): IOATNodePosition => {
    // Find the amount of nodes at the same position
    const nodesAtPosition = positions.filter(
        (model) =>
            model.position.x === coordinates.x &&
            model.position.y === coordinates.y
    );

    // If there is no node at the same position, return the coordinates
    if (nodesAtPosition.length === 0) {
        return coordinates;
    }
    // Define the new coordinates
    const newCoordinates = {
        x: coordinates.x + nodesAtPosition.length * NEW_NODE_OFFSET,
        y: coordinates.y + nodesAtPosition.length * NEW_NODE_OFFSET
    };
    // Prevent nodes with the same position
    return getNewNodePosition(newCoordinates, positions);
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
