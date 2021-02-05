require('colors');
const fs = require('fs');
const consumeTemplates = require('./templates/consume');
const createTemplates = require('./templates/create');

// Grab and validate componentName from script args
const componentName = process.argv[2];

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

// Generate component directory
console.log('Creating component templates with name: ', componentName);
const componentDirectory = `./src/Cards/${componentName}`;
if (fs.existsSync(componentDirectory)) {
    console.error(`Component ${componentName} already exists.`.red);
    process.exit(1);
}
fs.mkdirSync(componentDirectory);

// Generate sub component /Consume and /Create templates
const subComponents = [
    {
        dirName: `${componentDirectory}/Consume`,
        name: componentName,
        templates: consumeTemplates
    },
    {
        dirName: `${componentDirectory}/Create`,
        name: componentName + 'Create',
        templates: createTemplates
    }
];

subComponents.forEach((comp) => {
    fs.mkdirSync(comp.dirName);

    const generatedTemplates = comp.templates.map((template) =>
        template(comp.name, componentName)
    );

    generatedTemplates.forEach((template) => {
        fs.writeFileSync(
            `${comp.dirName}/${comp.name}${template.extension}`,
            template.content
        );
    });

    console.log(
        `${comp.name} component created successfully under: `,
        comp.dirName.green
    );
});
