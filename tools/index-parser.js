const fs = require('fs');
const strip = require('strip-comments');

const parseExportListFromIndex = (
    indexPath,
    pathPrefix,
    fileExtension,
    entryPointFolder
) => {
    const indexBuffer = fs.readFileSync(indexPath, 'utf-8');
    const exportList = strip(indexBuffer).split('\n');

    const outputExportMap = {};

    exportList
        .filter((exportLine) => exportLine.includes('default as'))
        .forEach((exportLine) => {
            let entryPointName = null;
            let entryPointPath = null;
            try {
                // Parse entry point name, matching name with { export as <name> }
                const name = exportLine
                    .match(/{([^}]+)}/)[1]
                    .trim()
                    .split(' ')[2];
                if (entryPointFolder) {
                    entryPointName = `${entryPointFolder}/${name}`;
                } else {
                    entryPointName = name;
                }
            } catch (err) {
                console.log(
                    `${exportLine} failed to parse entry point name using {'default as <name>'} export syntax`,
                    err
                );
            }

            try {
                // Parse entry point path
                const path = exportLine
                    .match(/'([^']+)'/)[1]
                    .replace('.', pathPrefix);
                entryPointPath = path + fileExtension;
            } catch (err) {
                console.log(
                    `${exportLine} failed to parse entry point path using './<path>' export syntax`,
                    err
                );
            }

            if (entryPointName && entryPointPath) {
                outputExportMap[entryPointName] = entryPointPath;
            }
        });

    console.log(
        `--- Parsing following data from index file ---
Path to index file: ${indexPath}
Path to prefix index file path references: ${pathPrefix}
Extension to suffix each path: ${fileExtension}
Entry point folder to group index file paths under: ${entryPointFolder}

The following entry point - path mapping was generated:
`,
        outputExportMap
    );

    return outputExportMap;
};

module.exports = parseExportListFromIndex;
