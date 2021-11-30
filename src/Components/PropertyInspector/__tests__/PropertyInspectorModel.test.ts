import { DtdlInterface, EntityKind } from '../../../Models/Constants';
import PropertyInspectorModel from '../PropertyInspectoryModel';
import testModel from './testModel.json';
import testTwin from './testTwin.json';
import testRelationship from './testRelationship.json';

const rootModelId = 'dtmi:com:test:testmodel;1';
let modelDict = null;
let propertyInspectorTwinNodes = null;

describe('Testing PropertyInspectorModel', () => {
    beforeAll(async () => {
        modelDict = await PropertyInspectorModel.parseDtdl(
            testModel as DtdlInterface[]
        );
    });

    test('DTDL models were parsed', () => {
        expect(Object.keys(modelDict).length).toBeGreaterThan(0);
    });

    describe('Parsing twin into property tree', () => {
        beforeAll(async () => {
            propertyInspectorTwinNodes = PropertyInspectorModel.parseTwinIntoPropertyTree(
                {
                    twin: testTwin,
                    interfaceInfo: modelDict[rootModelId],
                    path: ''
                }
            );
        });

        test('Property inspector nodes were created from twin and models', () => {
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
                ].includes(targetPiNode.schema as EntityKind)
            ) {
                valueOnTwin = String(valueOnTwin);
            }
            expect(targetPiNode.value).toEqual(valueOnTwin);

            return {
                targetPiNode,
                valueOnTwin
            };
        };

        test('Boolean property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testBoolean');
        });

        test('Date property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testDate');
        });

        test('DateTime property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testDateTime');
        });

        test('Double property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testDouble');
        });

        test('Float property with unit was parsed into tree node and matches value on twin', () => {
            const { targetPiNode } = checkPrimitiveNode('testFloatWithUnit');
            expect(targetPiNode.unit).toEqual('kWh');
        });

        test('Integer property with unit was parsed into tree node and matches value on twin', () => {
            const { targetPiNode } = checkPrimitiveNode('testIntegerWithUnit');
            expect(targetPiNode.unit).toEqual('mi');
        });

        test('Long property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testLong');
        });

        test('String property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testString');
        });

        test('Time property was parsed into tree node and matches value on twin', () => {
            checkPrimitiveNode('testTime');
        });

        test('Components are present in the tree nodes, are set, and have $metadata and children present', () => {
            // Check testComponentObjectModel is parsed into tree
            const componentA = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                propertyInspectorTwinNodes,
                `/testComponentObjectModel`
            );
            expect(componentA.type).toEqual(EntityKind.COMPONENT);
            expect(componentA.name).toEqual('testComponentObjectModel');
            expect(componentA.children.length).toBeGreaterThan(0);
            expect(componentA.children.find((n) => n.isMetadata)).toBeTruthy();
            expect(componentA.isSet).toBe(true);

            // Check testComponentMapModel is parsed into tree
            const componentB = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                propertyInspectorTwinNodes,
                `/testComponentMapModel`
            );
            expect(componentB.type).toEqual(EntityKind.COMPONENT);
            expect(componentB.name).toEqual('testComponentMapModel');
            expect(componentB.children.length).toBeGreaterThan(0);
            expect(componentB.children.find((n) => n.isMetadata)).toBeTruthy();
            expect(componentB.isSet).toBe(true);
        });

        test('Component with object was parsed into tree node and matches value on test twin', () => {
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

            const testObject_EnumChildNode = PropertyInspectorModel.findPropertyTreeNodeRefRecursively(
                propertyInspectorTwinNodes,
                '/testComponentObjectModel/testObject/testObject_ObjectChild/testObject_EnumChild'
            );

            expect(
                objectOnTwin.testObject_ObjectChild.testObject_EnumChild
            ).toEqual(testObject_EnumChildNode.value);
        });

        test('Map (within component) was parsed into tree node and matches value on test twin', () => {
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
                String(
                    testTwin.testComponentMapModel.testMap.testValue.testDouble
                )
            );
        });
    });

    let propertyInspectorRelationshipNodes = null;

    describe('Parsing relationship into property tree', () => {
        beforeAll(async () => {
            propertyInspectorRelationshipNodes = PropertyInspectorModel.parseRelationshipIntoPropertyTree(
                testRelationship,
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
});
