import { DTDLModel } from '../../../../Models/Classes/DTDL';
import { ModelPosition } from '../Types';

export class ProjectData {
    modelPositions?: ModelPosition[];
    models?: DTDLModel[];
    projectDescription?: string;
    projectName?: string;
    templates: any[];
    namespace?: string;

    constructor(
        modelPositions: ModelPosition[],
        models: DTDLModel[],
        projectDescription: string,
        projectName: string,
        templates: any[],
        namespace: string
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectDescription = projectDescription;
        this.projectName = projectName;
        this.templates = templates;
        this.namespace = namespace;
    }
}
