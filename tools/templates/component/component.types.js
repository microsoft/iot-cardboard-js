module.exports = (componentName) => ({
    content: `// TODO -- remove eslint overrides if not using
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ${componentName}Props {}
`,
    extension: `.types.ts`
});
