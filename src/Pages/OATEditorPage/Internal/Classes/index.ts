import { DTDLModel } from '../../../../Models/Classes/DTDL';
import { IModelPosition, IModelsMetadata } from '../../OATEditorPage.types';

export class ProjectData {
    modelPositions?: IModelPosition[];
    models?: DTDLModel[];
    projectDescription?: string;
    projectName?: string;
    templates: any[];
    namespace?: string;
    modelsMetadata?: IModelsMetadata[];

    constructor(
        modelPositions: IModelPosition[],
        models: DTDLModel[],
        projectName: string,
        templates: any[],
        namespace: string,
        modelsMetadata: IModelsMetadata[]
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectName = projectName;
        this.templates = templates;
        this.namespace = namespace;
        this.modelsMetadata = modelsMetadata;
    }
}
