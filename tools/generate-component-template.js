require('colors');
const fs = require('fs');
const componentTemplates = require('./templates/component');
const { exec } = require('child_process');

// Grab and validate componentName from script args
const componentName = process.argv[2];

// Grab and validate appName from script args
const appName = process.argv[3];

if (!componentName) {
    console.error(
        'Please enter valid component name.  Use syntax: npm run generate [componentName]'
            .red
    );
    process.exit(1);
}

if (componentName[0] !== componentName[0].toUpperCase()) {
    console.error(
        `[${componentName}] is invalid.  The first letter of a component must be capitalized.`
            .red
    );
    process.exit(1);
}

let componentDirectory = `./src/Components/${componentName}`;

if (appName) {
    if (appName[0] !== appName[0].toUpperCase()) {
        console.error(
            `[${appName}] is invalid.  The first letter of a component must be capitalized.`
                .red
        );
        process.exit(1);
    }

    const appNameFolder = `./src/Apps/${appName}`;
    if (!fs.existsSync(appNameFolder)) {
        console.error(
            `[${appName}] folder does not exist. Please create it before running this command.`
                .red
        );
        process.exit(1);
    }

    componentDirectory = `./src/Apps/${appName}/Components/${componentName}`;
}

// Generate component directory
console.log(
    'Creating component templates with name: '.cyan,
    componentName.green
);

if (fs.existsSync(componentDirectory)) {
    console.error(`Component ${componentName} already exists.`.red);
    process.exit(1);
}
fs.mkdirSync(componentDirectory);

// Generate sub component /Consume and /Create templates

const generatedTemplates = componentTemplates.map((template) =>
    template(componentName, componentDirectory)
);

generatedTemplates.forEach((template) => {
    fs.writeFileSync(
        `${componentDirectory}/${componentName}${template.extension}`,
        template.content
    );
});

console.log(
    `${componentName} component created successfully under: `.cyan,
    componentDirectory.green
);

console.log(`Linting component directory with prettier... `.cyan);

// Run prettier on generated files
exec(`prettier --write ${componentDirectory}/**/*.{js,ts,tsx,scss}`);
