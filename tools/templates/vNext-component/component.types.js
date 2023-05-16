module.exports = (componentName) => ({
    content: `

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface I${componentName}Props {
    }
    
    export type T${componentName}ClassNames = 'root';
    
`,
    extension: `.types.ts`
});
