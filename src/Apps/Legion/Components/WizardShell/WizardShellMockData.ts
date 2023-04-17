import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import MockDataManagementAdapter from '../../Adapters/Standalone/DataManagement/MockDataManagementAdapter';
import { IGraphContextProviderProps } from '../../Contexts/GraphContext/GraphContext.types';
import { IWizardDataManagementContextState } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { IWizardNavigationContextState } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
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
