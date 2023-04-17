import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { IGraphContextProviderProps } from '../../Contexts/GraphContext/GraphContext.types';
import { IWizardDataContextState } from '../../Contexts/WizardDataContext/WizardDataContext.types';
import { IWizardDataManagementContextState } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { IWizardNavigationContextState } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import {
    IDbEntity,
    IDbProperty,
    IDbRelationship,
    IDbType,
    Kind,
    IDbRelationshipType
} from '../../Models';
import {
    IAppData,
    IModel,
    IModelProperty,
    IRelationship,
    IRelationshipModel,
    ITwin
} from '../../Models/Interfaces';
import { TableTypes } from '../DataPusher/DataPusher.types';

const modelIds = ['model-1', 'model-2', 'model-3'];
const propertyIds = ['temp', 'pres', 'fanspd', 'flowrate'];
const twinIds = ['past_1', 'salt_1', 'salt_2', 'past_2', 'Dryer_1'];

const MODELS_MOCK_DATA: IModel[] = [
    {
        id: modelIds[0],
        name: 'model-1',
        propertyIds: [propertyIds[0], propertyIds[1]]
    },
    {
        id: modelIds[1],
        name: 'model-2',
        propertyIds: [propertyIds[2], propertyIds[3]]
    },
    {
        id: modelIds[2],
        name: 'model-3',
        propertyIds: [propertyIds[1], propertyIds[2]]
    }
];

const PROPERTIES_MOCK_DATA: IModelProperty[] = [
    {
        id: propertyIds[0],
        dataType: 'int',
        name: 'Temperature',
        sourcePropName: '$temp'
    },
    {
        id: propertyIds[1],
        dataType: 'int',
        name: 'Pressure',
        sourcePropName: '$press'
    },
    {
        id: propertyIds[2],
        dataType: 'int',
        name: 'Fan Speed',
        sourcePropName: '$fnspd'
    },
    {
        id: propertyIds[3],
        dataType: 'int',
        name: 'Flow rate',
        sourcePropName: '$flwrate'
    }
];

const TWINS_MOCK_DATA: ITwin[] = [
    {
        id: twinIds[0],
        modelId: modelIds[0],
        name: 'Pasteurization Machine 1',
        sourceConnectionString: 'src'
    },
    {
        id: twinIds[1],
        modelId: modelIds[1],
        name: 'Salt Machine 1',
        sourceConnectionString: 'src'
    },
    {
        id: twinIds[2],
        modelId: modelIds[1],
        name: 'Salt Machine 2',
        sourceConnectionString: 'src'
    },
    {
        id: twinIds[3],
        modelId: modelIds[0],
        name: 'Pasteurization Machine 2',
        sourceConnectionString: 'src'
    },
    {
        id: twinIds[4],
        modelId: modelIds[2],
        name: 'Dryer 1',
        sourceConnectionString: 'src'
    }
];
const RELATIONSHIPS_MOCK_DATA: IRelationship[] = [
    {
        id: 'rel1',
        relationshipModelId: 'parent1',
        sourceTwinId: TWINS_MOCK_DATA[0].id,
        targetTwinId: TWINS_MOCK_DATA[1].id
    },
    {
        id: 'rel2',
        relationshipModelId: 'contains',
        sourceTwinId: TWINS_MOCK_DATA[1].id,
        targetTwinId: TWINS_MOCK_DATA[2].id
    },
    {
        id: 'rel3',
        relationshipModelId: 'contains',
        sourceTwinId: TWINS_MOCK_DATA[1].id,
        targetTwinId: TWINS_MOCK_DATA[3].id
    }
];
const RELATIONSHIP_MODELS_MOCK_DATA: IRelationshipModel[] = [
    {
        id: 'parent1',
        name: 'isParentOf'
    },
    {
        id: 'contains',
        name: 'Contains'
    }
];
export const steps: IStepperWizardStep[] = [
    {
        label: 'Connect'
    },
    {
        label: 'Verify'
    },
    {
        label: 'Build'
    },
    {
        label: 'Finish'
    }
];

export const WIZARD_NAVIGATION_MOCK_DATA: IWizardNavigationContextState = {
    adapter: new MockDataManagementAdapter(),
    steps: steps,
    currentStep: 0
};

const mockAppData: IAppData = {
    models: MODELS_MOCK_DATA,
    properties: PROPERTIES_MOCK_DATA,
    twins: TWINS_MOCK_DATA,
    relationships: RELATIONSHIPS_MOCK_DATA,
    relationshipModels: RELATIONSHIP_MODELS_MOCK_DATA
};

export const DEFAULT_MOCK_DATA_MANAGEMENT_STATE: IWizardDataManagementContextState = {
    initialAssets: mockAppData,
    modifiedAssets: mockAppData,
    sources: [
        {
            selectedSourceDatabase: '',
            selectedSourceTable: '',
            selectedSourceTwinIDColumn: '',
            selectedSourceTableType: TableTypes.Wide,
            selectedTargetDatabase: ''
        }
    ]
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
        sourcePropId: `mockSourcePropId-${name}`,
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

export const GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT = (): IWizardDataContextState => {
    const prop1 = getProperty({ friendlyName: 'property1' });
    const type1 = getType({ friendlyName: '', propertyIds: [prop1.id] });
    const entity1 = getEntity({
        friendlyName: 'Some entity 1',
        typeId: type1.id
    });
    const entity2 = getEntity({
        friendlyName: 'Some entity 2',
        typeId: type1.id
    });

    const relationshipType1 = getMockRelationshipType({
        name: 'Parent'
    });
    const relationship1 = getMockRelationship({
        sourceEntityId: entity1.id,
        targetEntityId: entity2.id,
        typeId: relationshipType1.id
    });

    const data = {
        entities: [entity1, entity2],
        properties: [prop1],
        relationshipTypes: [relationshipType1],
        relationships: [relationship1],
        types: [type1]
    };
    console.log('Creating mock data', data);

    return data;
};
