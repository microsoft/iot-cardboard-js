module.exports = (componentName) => ({
    content: `// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ${componentName}Props {}
`,
    extension: `.types.ts`
});
