export default class ADTModel {
    name: string;
    properties: Array<any>;
    relationships: Array<any>;

    constructor(name, properties = [], relationships = []) {
        this.name = name;
        this.properties = properties;
        this.relationships = relationships;
    }

    toDTDL() {
        return {
            '@id': this.createId(),
            '@type': 'Interface',
            '@context': 'dtmi:dtdl:context;2',
            displayName: this.name,
            contents: [...this.properties, ...this.relationships]
        };
    }

    createId() {
        return `dtmi:assetGen:${this.name};1`;
    }
}
