require('colors');
const fs = require('fs');
const generator = require('json-schema-to-typescript');
const prettierConfig = require('../.prettierrc.json');
const path = require('path');

const schemaVersion = 'v1.1.0';

const schemaPath = path.resolve(
    __dirname,
    '../schemas/3DScenesConfiguration/v1.0.0/3DScenesConfiguration.schema.json'
);

const generatedTypesOutputFolder = path.resolve(
    __dirname,
    '../src/Models/Types/Generated'
);
const generatedTypesFileName = `3DScenesConfiguration-${schemaVersion}.d.ts`;

async function generate() {
    if (!fs.existsSync(generatedTypesOutputFolder)) {
        console.log(
            `Creating 3DSceneConfiguration types folder: ${generatedTypesOutputFolder}`
                .green
        );
        fs.mkdirSync(generatedTypesOutputFolder);
    }

    fs.writeFileSync(
        `${generatedTypesOutputFolder}/${generatedTypesFileName}`,
        await generator.compileFromFile(schemaPath, {
            style: prettierConfig
        })
    );
    console.log(
        `${generatedTypesOutputFolder}/${generatedTypesFileName} generated`
            .green
    );
}

generate();
