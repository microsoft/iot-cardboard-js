module.exports = (componentName) => ({
    content: `export * from './${componentName}';
    export * from './${componentName}.types';
    
`,
    extension: `.ts`
});
