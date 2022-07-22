import { Node, Edge } from 'react-flow-renderer';
import {
    OATComponentHandleName,
    OATExtendHandleName,
    OATInterfaceType,
    OATRelationshipHandleName,
    OATUntargetedRelationshipName
} from '../../../Models/Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlRelationship
} from '../../../Models/Constants/dtdlInterfaces';
import {
    IOATModelPosition,
    IOATSelection
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { ElementEdge } from './Classes/ElementEdge';
import { ElementNode } from './Classes/ElementNode';
import { ElementPosition } from './Classes/ElementPosition';

export const versionClassBase = '1';
export const contextClassBase = 'dtmi:dtdl:context;2';
export const defaultNodePosition = 25;

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
                    `${OATRelationshipHandleName}_${relationshipIndex}`
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
    const nextRelIndex = getNextRelationshipIndex(sourceId, elements);
    const name =
        relationship.name || `${OATRelationshipHandleName}_${nextRelIndex}`;
    const id = relationship['@id'] || `${sourceId}_${name}`;
    const relationshipEdge = new ElementEdge(
        id,
        '',
        OATRelationshipHandleName,
        '',
        sourceId,
        OATRelationshipHandleName,
        relationship['target'],
        OATRelationshipHandleName,
        {
            ...relationship,
            '@type': OATRelationshipHandleName,
            name
        }
    );

    elements.push(relationshipEdge);
    return relationshipEdge;
};

export const addUntargetedRelationship = (
    sourceId: string,
    relationship: DtdlInterfaceContent,
    modelPositions: IOATModelPosition[],
    elements: (ElementNode | ElementEdge)[]
) => {
    const nextRelIndex = getNextRelationshipIndex(sourceId, elements);
    const name =
        relationship.name || `${OATRelationshipHandleName}_${nextRelIndex}`;
    const id = relationship['@id'] || `${sourceId}_${name}`;
    const rp = modelPositions.find((x) => x['@id'] === id);
    const newNode = new ElementNode(
        id,
        OATInterfaceType,
        {
            x: rp ? rp.position.x : defaultNodePosition,
            y: rp ? rp.position.y : defaultNodePosition
        },
        {
            '@id': sourceId,
            '@type': OATUntargetedRelationshipName,
            '@context': contextClassBase,
            displayName: '',
            contents: []
        }
    );
    const relationshipEdge = new ElementEdge(
        id,
        '',
        OATRelationshipHandleName,
        '',
        sourceId,
        OATUntargetedRelationshipName,
        id,
        OATUntargetedRelationshipName,
        {
            ...relationship,
            '@id': id,
            '@type': OATUntargetedRelationshipName,
            name
        }
    );

    elements.push(newNode);
    elements.push(relationshipEdge);
    return relationshipEdge;
};

export const addComponentRelationship = (
    sourceId: string,
    component: DtdlInterfaceContent,
    targetName: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    const nextComIndex = getNextComponentIndex(sourceId, targetName, elements);
    const name = component.name || `${targetName}_${nextComIndex}`;
    const relationshipEdge = new ElementEdge(
        `${sourceId}${OATComponentHandleName}${component.schema}${name}`,
        '',
        OATRelationshipHandleName,
        '',
        sourceId,
        OATComponentHandleName,
        component.schema as string,
        OATComponentHandleName,
        {
            ...component,
            '@type': OATComponentHandleName,
            name
        }
    );

    elements.push(relationshipEdge);
    return relationshipEdge;
};

export const addExtendsRelationship = (
    sourceId: string,
    extend: string,
    elements: (ElementNode | ElementEdge)[]
) => {
    const relationshipEdge = new ElementEdge(
        `${sourceId}${OATExtendHandleName}${extend}`,
        '',
        OATRelationshipHandleName,
        '',
        sourceId,
        OATExtendHandleName,
        extend,
        OATExtendHandleName,
        {
            '@id': `${sourceId}${OATExtendHandleName}${extend}`,
            '@type': OATExtendHandleName,
            name: ''
        }
    );
    elements.push(relationshipEdge);
    return relationshipEdge;
};

export const addNewModel = (
    newModelId: number,
    idClassBase: string,
    position: ElementPosition,
    elements: (ElementNode | ElementEdge)[]
) => {
    const id = `${idClassBase}model${newModelId};${versionClassBase}`;
    const name = `Model${newModelId}`;
    const newNode = new ElementNode(id, OATInterfaceType, position, {
        '@id': id,
        '@context': contextClassBase,
        '@type': OATInterfaceType,
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
        case OATExtendHandleName:
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
