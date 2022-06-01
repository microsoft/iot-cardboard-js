import { DTDLModel, DTDLRelationship } from '../../../../Models/Classes/DTDL';
import { ModelPosition } from '../Types';

export class ProjectData {
    modelPositions?: ModelPosition[];
    models?: DTDLModel[];
    projectDescription?: string;
    projectName?: string;
    templates: any[];

    constructor(
        modelPositions: ModelPosition[],
        models: DTDLModel[],
        projectDescription: string,
        projectName: string,
        templates: any[]
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectDescription = projectDescription;
        this.projectName = projectName;
        this.templates = templates;
    }
}
