import { IStepperWizardStep } from '../../../../Components/StepperWizard/StepperWizard.types';
import { IDataManagementContextState } from '../../Contexts/DataManagementContext/DataManagementContext.types';
import {
    IAppData,
    IModel,
    IModelProperty,
    ITwin
} from '../../Models/Interfaces';
import { TableTypes } from '../DataPusher/DataPusher.types';

const modelIds = ['model-1', 'model-2', 'model-3'];
const propertyIds = ['temp', 'pres', 'fanspd', 'flowrate'];
const twinIds = ['past_1', 'salt_1', 'salt_2', 'past_2', 'Dryer_1'];

export const mockModels: IModel[] = [
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

export const mockProperties: IModelProperty[] = [
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

export const mockTwins: ITwin[] = [
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

export const appData: IAppData = {
    models: mockModels,
    properties: mockProperties,
    twins: mockTwins,
    relationships: [],
    relationshipModels: []
};

export const wizardData: IDataManagementContextState = {
    initialAssets: appData,
    modifiedAssets: appData,
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
