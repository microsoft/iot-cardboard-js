import { dtdlPropertyTypesEnum } from '../../..';
import { DTDLSchemaType, DTDLType } from '../../../Models/Classes/DTDL';
import { DtdlInterface, DtdlProperty } from '../../../Models/Constants';
import PropertyInspectorModel from '../PropertyInspectoryModel';
import { NodeRole } from '../PropertyTree/PropertyTree.types';
import testModel from './testModel.json';
import testTwin from './testTwin.json';

jest.mock('../../../i18n.ts', () => ({ t: () => 'testTranslation' }));

describe('Property nodes are parsed correctly', () => {
    test('Object property is correctly parsed into a tree node', () => {
        const testObject: DtdlProperty = {
            '@type': DTDLType.Property,
            name: 'testObject',
            schema: {
                '@type': DTDLSchemaType.Object,
                fields: [
                    {
                        name: 'testObject_DoubleChild',
                        schema: 'double'
                    },
                    {
                        name: 'testObject_ObjectChild',
                        schema: {
                            '@type': DTDLSchemaType.Object,
                            fields: [
                                {
                                    name: 'testObject_ObjectChild_StringChild',
                                    schema: 'string'
                                }
                            ]
                        }
                    }
                ]
            },
            writable: true
        };

        const node = PropertyInspectorModel.parsePropertyIntoNode({
            isInherited: false,
            isMapChild: false,
            isObjectChild: false,
            modelProperty: testObject,
            path: '',
            propertySourceObject: {}
        });

        expect(node.name).toBe('testObject');
        expect(node.role).toBe(NodeRole.parent);
        expect(node.children).toHaveLength(2);

        const firstChild = node?.children?.[0];
        expect(firstChild.name).toBe('testObject_DoubleChild');
        expect(firstChild.role).toBe(NodeRole.leaf);
        expect(firstChild.path).toBe('/testObject/testObject_DoubleChild');
        expect(firstChild.schema).toBe(dtdlPropertyTypesEnum.double);

        const secondChild = node?.children?.[1];
        expect(secondChild.name).toBe('testObject_ObjectChild');
        expect(secondChild.role).toBe(NodeRole.parent);
        expect(secondChild.path).toBe('/testObject/testObject_ObjectChild');
        expect(secondChild.schema).toBe(dtdlPropertyTypesEnum.Object);
        expect(secondChild.children).toHaveLength(1);
    });

    test('Map property is correctly parsed into a tree node', () => {
        const testMap: DtdlProperty = {
            '@type': DTDLType.Property,
            name: 'testMap',
            writable: true,
            schema: {
                '@type': DTDLSchemaType.Map,
                mapKey: {
                    name: 'testMapKey',
                    schema: 'string'
                },
                mapValue: {
                    name: 'testMapValue',
                    schema: {
                        '@type': DTDLSchemaType.Object,
                        fields: [
                            {
                                name: 'testString',
                                schema: 'string'
                            },
                            {
                                name: 'testDouble',
                                schema: 'double'
                            }
                        ]
                    }
                }
            }
        };

        const node = PropertyInspectorModel.parsePropertyIntoNode({
            isInherited: false,
            isMapChild: false,
            isObjectChild: false,
            modelProperty: testMap,
            path: '',
            propertySourceObject: {
                testMap: {
                    testValue: {
                        testString: 'abc',
                        testDouble: 123
                    }
                }
            }
        });

        expect(node.name).toBe('testMap');
        expect(node.role).toBe(NodeRole.parent);
        expect(node.children).toHaveLength(1);

        const mapValue = node?.children?.[0];
        expect(mapValue.path).toBe('/testMap/testValue');

        const mapValueChild = mapValue?.children?.[0];
        expect(mapValueChild.path).toBe('/testMap/testValue/testString');
        expect(mapValueChild.value).toBe('abc');
    });

    test('Array nodes are parsed correctly', () => {
        const testModel: DtdlProperty = {
            '@type': DTDLType.Property,
            name: 'testArray',
            schema: {
                '@type': DTDLSchemaType.Array,
                elementSchema: 'string'
            }
        };

        const node = PropertyInspectorModel.parsePropertyIntoNode({
            isInherited: false,
            isMapChild: false,
            isObjectChild: false,
            modelProperty: testModel,
            path: '',
            propertySourceObject: {
                testArray: ['abc', 'def', 'ghi']
            },
            isArrayItem: true
        });

        expect(node.name).toBe('testArray');
        expect(node.role).toBe(NodeRole.parent);
        expect(node.children).toHaveLength(3);

        const arrayValue = node?.children?.[0];
        expect(arrayValue.path).toBe('/testArray[0]');

        const arrayValueChild = node?.children?.[2];
        expect(arrayValueChild.path).toBe('/testArray[2]');
        expect(arrayValueChild.value).toBe('ghi');
    });
});

let propertyInspectorTwinNodes = null;

describe('Parsing twin into property tree', () => {
    beforeAll(() => {
        propertyInspectorTwinNodes = PropertyInspectorModel.parseTwinIntoPropertyTree(
            {
                twin: testTwin,
                expandedModels: testModel as DtdlInterface[],
                rootModel: testModel[0] as DtdlInterface,
                isInherited: false,
                path: ''
            }
        );
    });

    test('Property inspector nodes were parsed', () => {
        expect(propertyInspectorTwinNodes.length).toBeGreaterThanOrEqual(1);
    });

    const checkPrimitiveNode = (targetNodeName) => {
        const targetPiNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/${targetNodeName}`
        );
        let valueOnTwin = testTwin[targetNodeName];

        // numeric types stored internally as strings (convert)
        if (
            [
                dtdlPropertyTypesEnum.integer,
                dtdlPropertyTypesEnum.float,
                dtdlPropertyTypesEnum.double,
                dtdlPropertyTypesEnum.long
            ].includes(targetPiNode.schema)
        ) {
            valueOnTwin = String(valueOnTwin);
        }
        expect(targetPiNode.value).toEqual(valueOnTwin);

        return {
            targetPiNode,
            valueOnTwin
        };
    };

    test('Boolean property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testBoolean');
    });

    test('Date property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testDate');
    });

    test('DateTime property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testDateTime');
    });

    test('Double property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testDouble');
    });

    test('Float property with unit is set in inspector and matches value on twin', () => {
        const { targetPiNode } = checkPrimitiveNode('testFloatWithUnit');
        expect(targetPiNode.unit).toEqual('kilowattHour');
    });

    test('Integer property with unit is set in inspector and matches value on twin', () => {
        const { targetPiNode } = checkPrimitiveNode('testIntegerWithUnit');
        expect(targetPiNode.unit).toEqual('mile');
    });

    test('Long property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testLong');
    });

    test('String property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testString');
    });

    test('Time property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testTime');
    });

    test('Enum property is set in inspector and matches value on twin', () => {
        checkPrimitiveNode('testEnum');
    });

    test('Components are present in the tree nodes', () => {
        // Check testComponentObjectModel is parsed into tree
        const componentA = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/testComponentObjectModel`
        );
        expect(componentA.type).toEqual(DTDLType.Component);
        expect(componentA.name).toEqual('testComponentObjectModel');

        // Check testComponentMapModel is parsed into tree
        const componentB = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/testComponentMapModel`
        );
        expect(componentB.type).toEqual(DTDLType.Component);
        expect(componentB.name).toEqual('testComponentMapModel');
    });

    test('Object (within component) is set in inspector and matches value on test twin', () => {
        const objectOnComponent = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/testComponentObjectModel/testObject`
        );

        expect(objectOnComponent).toBeTruthy();

        // Check object children match twin values
        const objectOnTwin = testTwin.testComponentObjectModel.testObject;

        const testObject_DoubleChildNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            '/testComponentObjectModel/testObject/testObject_DoubleChild'
        );

        expect(String(objectOnTwin.testObject_DoubleChild)).toEqual(
            testObject_DoubleChildNode.value
        );

        const testObject_ObjectChildNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            '/testComponentObjectModel/testObject/testObject_ObjectChild/testObject_ObjectChild_StringChild'
        );

        expect(
            objectOnTwin.testObject_ObjectChild
                .testObject_ObjectChild_StringChild
        ).toEqual(testObject_ObjectChildNode.value);
    });

    test('Map (within component) is set in inspector and matches value on test twin', () => {
        const mapOnComponent = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/testComponentMapModel/testMap`
        );

        // Check map exists on component
        expect(mapOnComponent).toBeTruthy();

        const mapValue = mapOnComponent.children.find(
            (child) => child.name === 'testValue'
        );

        // Check that map value is present
        expect(mapValue).toBeTruthy();

        //Check that map value is type object and children match values on twin
        expect(mapValue.schema).toEqual(dtdlPropertyTypesEnum.Object);

        const testString = mapValue.children.find(
            (child) => child.name === 'testString'
        );
        expect(testString.value).toEqual(
            testTwin.testComponentMapModel.testMap.testValue.testString
        );

        const testDouble = mapValue.children.find(
            (child) => child.name === 'testDouble'
        );
        expect(testDouble.value).toEqual(
            String(testTwin.testComponentMapModel.testMap.testValue.testDouble)
        );
    });
});

let propertyInspectorRelationshipNodes = null;
const relationshipData = {
    $relationshipId: '4690c125-aac8-4456-9203-298c93f5fcf0',
    $etag: 'W/"4215f07a-ed6e-4c8d-a516-d65715f207d9"',
    $sourceId: 'Tesla',
    $relationshipName: 'chargedBy',
    $targetId: 'Windmill_1',
    lastChargedStation: 'Eugene Oregon Tesla Supercharger'
};

describe('Parsing relationship into property tree', () => {
    beforeAll(() => {
        propertyInspectorRelationshipNodes = PropertyInspectorModel.parseRelationshipIntoPropertyTree(
            relationshipData,
            (testModel as DtdlInterface[]).find(
                (m) => m['@id'] === 'dtmi:com:test:testmodel;1'
            )
        );
    });

    test('Property inspector nodes were parsed', () => {
        expect(
            propertyInspectorRelationshipNodes.length
        ).toBeGreaterThanOrEqual(1);
    });

    test('Property exists on relationship', () => {
        const relationshipProperty = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorRelationshipNodes,
            '/lastChargedStation'
        );

        expect(relationshipProperty).toBeTruthy();
        expect(relationshipProperty.value).toEqual(
            'Eugene Oregon Tesla Supercharger'
        );
    });
});
