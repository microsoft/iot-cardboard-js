import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import { IGraphContextProviderProps } from '../../Contexts/GraphContext/GraphContext.types';
import { IWizardDataContextState } from '../../Contexts/WizardDataContext/WizardDataContext.types';
import { IWizardNavigationContextState } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import {
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbType,
    Kind,
    IDbRelationshipType
} from '../../Models';

export const steps: IStepperWizardStep[] = [
    {
        label: 'Source'
    },
    {
        label: 'Modify'
    },
    {
        label: 'Save'
    }
];

export const WIZARD_NAVIGATION_MOCK_DATA: IWizardNavigationContextState = {
    steps: steps,
    currentStep: 0
};

/** mock data for the graph component */
export const DEFAULT_MOCK_GRAPH_PROVIDER_DATA: IGraphContextProviderProps<object> = {
    nodeData: [
        {
            id: 'mock-item-1',
            label: 'Mock item 1',
            data: {}
        },
        {
            id: 'mock-item-2',
            label: 'Mock item 2',
            data: {}
        },
        {
            id: 'mock-item-3',
            label: 'Mock item 3',
            data: {}
        },
        {
            id: 'mock-item-4',
            label: 'Mock item 4',
            data: {}
        }
    ]
};

const getEntity = (
    partial: Partial<IDbEntity> & { friendlyName: string; typeId: string }
): IDbEntity => {
    const name = partial.friendlyName.replace(/ /g, '');
    return {
        id: `id-${name}`,
        isDeleted: false,
        isNew: false,
        sourceConnectionString: 'mockSourceConnectionString',
        sourceEntityId: `mockSourceEntityId-${name}`,
        values: {},
        ...partial
    };
};

const getType = (
    partial: Partial<IDbType> & { friendlyName: string }
): IDbType => {
    const name = partial.friendlyName.replace(/ /g, '');
    return {
        color: '',
        icon: '',
        id: `id-${name}`,
        isDeleted: false,
        isNew: false,
        kind: Kind.Asset,
        propertyIds: [],
        ...partial
    };
};

const getProperty = (
    partial: Partial<IDbProperty> & { friendlyName: string }
): IDbProperty => {
    const name = partial.friendlyName;
    return {
        id: `id-${name}`,
        isDeleted: false,
        isNew: false,
        sourcePropName: `mockSourcePropId-${name}`,
        ...partial
    };
};

const getMockRelationship = (
    partial: Partial<IDbRelationship> & {
        sourceEntityId: string;
        targetEntityId: string;
        typeId: string;
    }
): IDbRelationship => {
    const name = partial.typeId;
    return {
        id: `id-${name}`,
        isDeleted: false,
        isNew: false,
        ...partial
    };
};

const getMockRelationshipType = (
    partial: Partial<IDbRelationshipType> & { name: string }
): IDbRelationshipType => {
    const name = partial.name.replace(/ /g, '');
    return {
        id: `id-${name}`,
        isDeleted: false,
        isNew: false,
        ...partial
    };
};

const setDairyData = (data: IWizardDataContextState) => {
    // PROPERTIES
    const propTemp = getProperty({
        friendlyName: 'Temperature',
        sourcePropName: 'Temp'
    });
    const propPress = getProperty({
        friendlyName: 'Pressure',
        sourcePropName: 'Press'
    });
    const propHum = getProperty({
        friendlyName: 'Humidity',
        sourcePropName: 'Hum'
    });
    const propFan = getProperty({
        friendlyName: 'Fan Speed',
        sourcePropName: 'FanSpd'
    });
    const propInflow = getProperty({
        friendlyName: 'Inflow',
        sourcePropName: 'InFlow'
    });
    const propOutflow = getProperty({
        friendlyName: 'Outflow',
        sourcePropName: 'OutFlow'
    });
    const propXPos = getProperty({
        friendlyName: 'xPos',
        sourcePropName: 'xPos'
    });
    const propYPos = getProperty({
        friendlyName: 'yPos',
        sourcePropName: 'yPos'
    });
    data.properties = [
        propTemp,
        propPress,
        propHum,
        propFan,
        propInflow,
        propOutflow,
        propXPos,
        propYPos
    ];

    // TYPES
    const typePastTs = getType({
        friendlyName: 'Pasteurizer TS',
        color: '#C13099',
        icon: 'LineChart',
        kind: Kind.TimeSeries,
        propertyIds: [propTemp.id, propPress.id],
        isNew: true
    });
    const typeSalterTs = getType({
        friendlyName: 'Salter TS',
        color: '#67C130',
        icon: 'LineChart',
        kind: Kind.TimeSeries,
        propertyIds: [propFan.id, propHum.id]
    });
    const typeDryerTs = getType({
        friendlyName: 'Dryer',
        color: '#FFA113',
        icon: 'LineChart',
        kind: Kind.TimeSeries,
        propertyIds: [propInflow.id, propOutflow.id]
    });
    const typeFactory = getType({
        friendlyName: 'Factory',
        color: '#732A9A',
        icon: 'EMI',
        kind: Kind.UserDefined,
        propertyIds: []
    });
    const typePid = getType({
        friendlyName: 'P&Id Type 1',
        color: '#DE564E',
        icon: 'SplitObject',
        kind: Kind.PID,
        propertyIds: [propXPos.id, propYPos.id]
    });
    const typePastAsset = getType({
        friendlyName: 'Pasteurizer',
        color: '#3AA0EB',
        icon: 'Manufacturing',
        kind: Kind.Asset,
        propertyIds: [propTemp.id, propPress.id]
    });
    data.types = [
        typeDryerTs,
        typeFactory,
        typeSalterTs,
        typePid,
        typePastAsset,
        typePastTs
    ];

    // ENTITIES
    const entPastA1Ts = getEntity({
        friendlyName: 'Pasteurizer A1',
        sourceEntityId: 'Pasteurizer_A1',
        typeId: typePastTs.id,
        sourceConnectionString: 'cluster:c1;db:db1;table:t1',
        values: { 'OEE Semantic Types': 'Uptime' }
    });
    const entPastA2Ts = getEntity({
        friendlyName: 'Pasteurizer A2',
        sourceEntityId: 'Pasteurizer_A2',
        typeId: typePastTs.id,
        sourceConnectionString: 'cluster:c1;db:db1;table:t1',
        values: {},
        isNew: true
    });
    const entSaltB1 = getEntity({
        friendlyName: 'Salter B1',
        sourceEntityId: 'Salter_B1',
        typeId: typeSalterTs.id,
        sourceConnectionString: 'cluster:c1;db:db1;table:t1',
        values: {},
        isNew: true
    });
    const entSaltB3 = getEntity({
        friendlyName: 'Salter B3',
        sourceEntityId: 'Salter_B3',
        typeId: typeSalterTs.id,
        sourceConnectionString: 'cluster:c1;db:db1;table:t1',
        values: {}
    });
    const entDryC1 = getEntity({
        friendlyName: 'Dryer C1',
        sourceEntityId: 'Dryer_C1',
        typeId: typeDryerTs.id,
        sourceConnectionString: 'cluster:c1;db:db1;table:t1',
        values: {}
    });
    const entRedmondFactory = getEntity({
        friendlyName: 'Redmond Factory',
        sourceEntityId: 'Factory_F1',
        typeId: typeFactory.id,
        sourceConnectionString: undefined,
        values: {}
    });
    const entPastA1Pid = getEntity({
        friendlyName: 'past_a1',
        sourceEntityId: 'past_a1',
        typeId: typePid.id,
        sourceConnectionString: 'https://myblob.com/P&ID.jpg',
        values: { xPos: '12', yPos: '25' }
    });
    const entPastA2Pid = getEntity({
        friendlyName: 'past_a2',
        sourceEntityId: 'past_a2',
        typeId: typePid.id,
        sourceConnectionString: 'https://myblob.com/P&ID.jpg',
        values: { xPos: '35', yPos: '12' }
    });
    const entPastA1Asset = getEntity({
        friendlyName: 'Pasteurizer A1',
        sourceEntityId: 'Pasteurizer_A1',
        typeId: typePastAsset.id,
        sourceConnectionString: undefined,
        values: undefined
    });
    const entPastA2Asset = getEntity({
        friendlyName: 'Pasteurizer A2',
        sourceEntityId: 'Pasteurizer_A2',
        typeId: typePastAsset.id,
        sourceConnectionString: undefined,
        values: undefined
    });
    data.entities = [
        entDryC1,
        entPastA1Asset,
        entPastA1Pid,
        entPastA1Ts,
        entPastA2Asset,
        entPastA2Pid,
        entPastA2Ts,
        entRedmondFactory,
        entSaltB1,
        entSaltB3
    ];

    // RELATIONSHIP TYPES
    const relTypeReference = getMockRelationshipType({
        name: 'References'
    });
    const relTypeContains = getMockRelationshipType({
        name: 'Contains'
    });
    data.relationshipTypes = [relTypeReference, relTypeContains];

    // RELATIONSHIPS
    const relFactorySaltB3 = getMockRelationship({
        sourceEntityId: entRedmondFactory.id,
        targetEntityId: entSaltB3.id,
        typeId: relTypeContains.id
    });
    const relFactoryPastA1Asset = getMockRelationship({
        sourceEntityId: entRedmondFactory.id,
        targetEntityId: entPastA1Asset.id,
        typeId: relTypeContains.id,
        isNew: true
    });
    const relFactoryPastA2Ts = getMockRelationship({
        sourceEntityId: entRedmondFactory.id,
        targetEntityId: entPastA2Ts.id,
        typeId: relTypeContains.id
    });
    const relPastA1AssetPastA1Ts = getMockRelationship({
        sourceEntityId: entPastA1Asset.id,
        targetEntityId: entPastA1Ts.id,
        typeId: relTypeReference.id
    });
    const relPastA1AssetPastA1Pid = getMockRelationship({
        sourceEntityId: entPastA1Asset.id,
        targetEntityId: entPastA1Pid.id,
        typeId: relTypeReference.id
    });
    const relPastA2AssetPastA2Ts = getMockRelationship({
        sourceEntityId: entPastA2Asset.id,
        targetEntityId: entPastA2Ts.id,
        typeId: relTypeReference.id
    });
    const relPastA2AssetPastA2Pid = getMockRelationship({
        sourceEntityId: entPastA2Asset.id,
        targetEntityId: entPastA2Pid.id,
        typeId: relTypeReference.id
    });
    data.relationships = [
        relFactoryPastA1Asset,
        relFactoryPastA2Ts,
        relFactorySaltB3,
        relPastA1AssetPastA1Pid,
        relPastA1AssetPastA1Ts,
        relPastA2AssetPastA2Pid,
        relPastA2AssetPastA2Ts
    ];
};
export const GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT = (
    scenario?: 'Dairy'
): IWizardDataContextState => {
    // default to dairy
    scenario = scenario ?? 'Dairy';

    const data: IWizardDataContextState = {
        entities: [],
        properties: [],
        relationshipTypes: [],
        relationships: [],
        types: []
    };
    switch (scenario) {
        case 'Dairy': {
            setDairyData(data);
        }
    }

    return data;
};
