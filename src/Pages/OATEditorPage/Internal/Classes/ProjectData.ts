import { DtdlInterface } from '../../../../Models/Constants';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../OATEditorPage.types';

export interface IOatProjectData {
    models: DtdlInterface[];
    modelPositions: IOATModelPosition[];
    modelsMetadata: IOATModelsMetadata[];
    defaultPath: string;
    projectDescription: string;
    projectName: string;
    templates: any[];
}
export class ProjectData implements IOatProjectData {
    models: DtdlInterface[];
    modelPositions: IOATModelPosition[];
    modelsMetadata: IOATModelsMetadata[];
    defaultPath: string;
    projectDescription: string;
    projectName: string;
    templates: any[];

    constructor(
        projectName: string,
        defaultPath: string,
        models?: DtdlInterface[],
        modelPositions?: IOATModelPosition[],
        modelsMetadata?: IOATModelsMetadata[],
        templates?: any[]
    ) {
        this.projectName = projectName || '';
        this.defaultPath = defaultPath || '';
        this.projectDescription = '';
        this.models = models ? Array.from(models) : [];
        this.modelPositions = modelPositions ? Array.from(modelPositions) : [];
        this.modelsMetadata = modelsMetadata ? Array.from(modelsMetadata) : [];
        this.templates = templates ? Array.from(templates) : [];
    }
}
