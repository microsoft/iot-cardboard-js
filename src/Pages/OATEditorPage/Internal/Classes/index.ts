import { DTDLModel } from '../../../../Models/Classes/DTDL';
import {
    IOATModelData,
    IOATModelPosition,
    IOATModelsMetadata
} from '../../OATEditorPage.types';

export class ProjectData {
    modelPositions?: IOATModelPosition[];
    models?: DTDLModel[];
    projectDescription?: string;
    projectName?: string;
    templates: any[];
    namespace?: string;
    modelsMetadata?: IOATModelsMetadata[];
    modelsData?: IOATModelData;

    constructor(
        modelPositions: IOATModelPosition[],
        models: DTDLModel[],
        projectName: string,
        templates: any[],
        namespace: string,
        modelsMetadata: IOATModelsMetadata[]
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectName = projectName;
        this.templates = templates;
        this.namespace = namespace;
        this.modelsMetadata = modelsMetadata;
    }
}
