require('colors');
const fs = require('fs');
const generator = require('json-schema-to-typescript');
const prettierConfig = require('../.prettierrc.json');

const schemaVersion = 'v1.0.0';
const schemaPath =
    './schemas/3DScenesConfiguration/v1.0.0/3DScenesConfiguration.schema.json';
const generatedTypesOutputFolder = './src/Models/Types/Generated';
const generatedTypesFileName = `3DScenesConfiguration-${schemaVersion}.d.ts`;

async function generate() {
    // Verify script is run from root (ie schemas folder exists)
    if (!fs.existsSync(schemaPath.slice(0, schemaPath.lastIndexOf('/')))) {
        console.error(
            `Schema path: ${schemaPath} not found.  Ensure this script is run from the root of the project & that the schema exists.`
                .red
        );
        process.exit(1);
    }
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
