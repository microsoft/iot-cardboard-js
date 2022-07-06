import { DTDLModel } from '../../../../Models/Classes/DTDL';
import { IModelsMetadata } from '../../OATEditorPage.types';
import { ModelPosition } from '../Types';

export class ProjectData {
    modelPositions?: ModelPosition[];
    models?: DTDLModel[];
    projectDescription?: string;
    projectName?: string;
    templates: any[];
    namespace?: string;
    modelsMetadata?: IModelsMetadata[];

    constructor(
        modelPositions: ModelPosition[],
        models: DTDLModel[],
        projectDescription: string,
        projectName: string,
        templates: any[],
        namespace: string,
        modelsMetadata: IModelsMetadata[]
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectDescription = projectDescription;
        this.projectName = projectName;
        this.templates = templates;
        this.namespace = namespace;
        this.modelsMetadata = modelsMetadata;
    }
}
