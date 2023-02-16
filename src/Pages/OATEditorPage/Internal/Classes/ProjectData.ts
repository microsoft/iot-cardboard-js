import { DTDL_CONTEXT_VERSION_2 } from '../../../../Models/Classes/DTDL';
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
    defaultContext: string;
    projectDescription: string;
    projectName: string;
    templates: any[];
}
export class ProjectData implements IOatProjectData {
    models: DtdlInterface[];
    modelPositions: IOATModelPosition[];
    modelsMetadata: IOATModelsMetadata[];
    defaultPath: string;
    defaultContext: string;
    projectDescription: string;
    projectName: string;
    templates: any[];

    constructor(
        projectName: string,
        defaultPath: string,
        defaultContext: string,
        models?: DtdlInterface[],
        modelPositions?: IOATModelPosition[],
        modelsMetadata?: IOATModelsMetadata[],
        templates?: any[]
    ) {
        this.projectName = projectName || '';
        this.defaultPath = defaultPath || '';
        this.defaultContext = defaultContext || DTDL_CONTEXT_VERSION_2;
        this.projectDescription = '';
        this.models = models ? Array.from(models) : [];
        this.modelPositions = modelPositions ? Array.from(modelPositions) : [];
        this.modelsMetadata = modelsMetadata ? Array.from(modelsMetadata) : [];
        this.templates = templates ? Array.from(templates) : [];
    }
}
