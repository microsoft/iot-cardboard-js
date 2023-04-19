module.exports = (componentName) => ({
    content: `import ${componentName} from './${componentName}';
    export default ${componentName};
    export * from './${componentName}.types';
    
`,
    extension: `.ts`
});
