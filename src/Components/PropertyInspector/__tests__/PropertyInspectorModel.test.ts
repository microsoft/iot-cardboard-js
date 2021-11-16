import { EntityKind } from 'azure-iot-parser-node';
import PropertyInspectorModel from '../PropertyInspectoryModel';
import testModel from './testModel.json';
import testTwin from './testTwin.json';

const rootModelId = 'dtmi:com:test:testmodel;1';
let propertyInspectorTwinNodes = null;

describe('Parsing twin into property tree', () => {
    beforeAll(async () => {
        const modelDict = await PropertyInspectorModel.parseDtdl(testModel);
        expect(modelDict).toBeTruthy();

        propertyInspectorTwinNodes = PropertyInspectorModel.parseTwinIntoPropertyTree(
            {
                twin: testTwin,
                interfaceInfo: modelDict[rootModelId],
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
                EntityKind.INTEGER,
                EntityKind.FLOAT,
                EntityKind.DOUBLE,
                EntityKind.LONG
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
        expect(targetPiNode.unit).toEqual('kWh');
    });

    test('Integer property with unit is set in inspector and matches value on twin', () => {
        const { targetPiNode } = checkPrimitiveNode('testIntegerWithUnit');
        expect(targetPiNode.unit).toEqual('mi');
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
        expect(componentA.type).toEqual(EntityKind.COMPONENT);
        expect(componentA.name).toEqual('testComponentObjectModel');

        // Check testComponentMapModel is parsed into tree
        const componentB = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
            propertyInspectorTwinNodes,
            `/testComponentMapModel`
        );
        expect(componentB.type).toEqual(EntityKind.COMPONENT);
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
        expect(mapValue.schema).toEqual(EntityKind.OBJECT);

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
    $sourceId: 'LeoTheDog',
    $relationshipName: 'chargedBy',
    $targetId: 'Windmill_1',
    lastChargedStation: 'Eugene Oregon Tesla Supercharger'
};

describe('Parsing relationship into property tree', () => {
    beforeAll(async () => {
        const modelDict = await PropertyInspectorModel.parseDtdl(testModel);
        expect(modelDict).toBeTruthy();

        propertyInspectorRelationshipNodes = PropertyInspectorModel.parseRelationshipIntoPropertyTree(
            relationshipData,
            modelDict
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
