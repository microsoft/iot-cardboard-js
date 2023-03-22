require('colors');
const fs = require('fs');
const componentTemplates = require('./templates/legionComponent');
const { exec } = require('child_process');

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
console.log(
    'Creating component templates with name: '.cyan,
    componentName.green
);
const componentDirectory = `./src/Apps/Legion/Components/${componentName}`;
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
