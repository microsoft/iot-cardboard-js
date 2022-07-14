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
export class RelationshipData {
    public '@id': string;
    public name: string;
    public displayName: string;
    public '@type': string;

    constructor(id: string, name: string, displayName: string, type: string) {
        this['@id'] = id;
        this.name = name;
        this.displayName = displayName;
        this['@type'] = type;
    }
}
