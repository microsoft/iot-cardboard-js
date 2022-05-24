import { DTDLModel, DTDLRelationship } from '../../../../Models/Classes/DTDL';
import { ModelPosition } from '../Types';

export class ProjectData {
    modelPositions?: ModelPosition[];
    models?: DTDLModel[] | DTDLRelationship[];
    projectDescription?: string;
    projectName?: string;

    constructor(
        modelPositions: ModelPosition[],
        models: DTDLModel[] | DTDLRelationship[],
        projectDescription: string,
        projectName: string
    ) {
        this.modelPositions = modelPositions;
        this.models = models;
        this.projectDescription = projectDescription;
        this.projectName = projectName;
    }
}
