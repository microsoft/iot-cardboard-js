import { DTDLModel } from '../../../../Models/Classes/DTDL';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../OATEditorPage.types';

export class ProjectData {
    models: DTDLModel[];
    modelPositions: IOATModelPosition[];
    modelsMetadata: IOATModelsMetadata[];
    namespace: string;
    projectDescription: string;
    projectName: string;
    templates: any[];

    constructor(
        projectName: string,
        namespace: string,
        models?: DTDLModel[],
        modelPositions?: IOATModelPosition[],
        modelsMetadata?: IOATModelsMetadata[],
        templates?: any[]
    ) {
        this.projectName = projectName || '';
        this.namespace = namespace || '';
        this.projectDescription = '';
        this.models = models ? Array.from(models) : [];
        this.modelPositions = modelPositions ? Array.from(modelPositions) : [];
        this.modelsMetadata = modelsMetadata ? Array.from(modelsMetadata) : [];
        this.templates = templates ? Array.from(templates) : [];
    }
}
