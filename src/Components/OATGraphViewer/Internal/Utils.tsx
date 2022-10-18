import { Node, Edge } from 'react-flow-renderer';
import {
    OAT_COMPONENT_HANDLE_NAME,
    OAT_EXTEND_HANDLE_NAME,
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

const getNextRelationshipIndex = (
    sourceId: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    let relationshipIndex = 0;
    while (
        elements.some(
            (element) =>
                (element as ElementEdge).source === sourceId &&
                (element.data as DtdlRelationship).name ===
                    `${OAT_RELATIONSHIP_HANDLE_NAME}_${relationshipIndex}`
        )
    ) {
        relationshipIndex++;
    }
    return relationshipIndex;
};

const getNextComponentIndex = (
    sourceId: string,
    targetName: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    let componentIndex = 0;
    const match = elements.find((element) => element.id === sourceId);
    if (match) {
        const int = match.data as DtdlInterface;
        while (
            int &&
            int.contents.some(
                (content) =>
                    content['schema'] &&
                    content.name === `${targetName}_${componentIndex}`
            )
        ) {
            componentIndex++;
        }
    }
    return componentIndex;
};

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
        OAT_RELATIONSHIP_HANDLE_NAME,
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
        OAT_RELATIONSHIP_HANDLE_NAME,
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
    // logDebugConsole(
    //     'debug',
    //     '[START] addComponentRelationship. {source, component, target, elements}',
    //     sourceId,
    //     component,
    //     targetName,
    //     elements
    // );
    const nextComIndex = getNextComponentIndex(sourceId, targetName, elements);
    const name = component.name || `${targetName}_${nextComIndex}`;
    const relationshipEdge = new ElementEdge(
        `${sourceId}${OAT_COMPONENT_HANDLE_NAME}${component.schema}${name}`,
        '',
        OAT_RELATIONSHIP_HANDLE_NAME,
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
    //     '[END] addComponentRelationship. {elements}',
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
        OAT_RELATIONSHIP_HANDLE_NAME,
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
 * Addsd a new model with default values to the graph
 * @param newModelId id for the new model
 * @param name Display name for the model
 * @param position position of the node
 * @param elements collection of existing elements
 * @returns new node that was added
 */
export const addNewModelToGraph = (
    newModelId: string,
    name: string,
    position: ElementPosition,
    elements: (ElementNode | ElementEdge)[]
) => {
    const newNode = new ElementNode(newModelId, OAT_INTERFACE_TYPE, position, {
        '@id': newModelId,
        '@context': CONTEXT_CLASS_BASE,
        '@type': OAT_INTERFACE_TYPE,
        displayName: name,
        contents: []
    });
    elements.push(newNode);
    return newNode;
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
