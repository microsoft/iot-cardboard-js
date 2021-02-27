module.exports = (componentName) => ({
    content: `import { ConsumeCardProps } from '../../../Models/Constants/Interfaces';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ${componentName}Props extends ConsumeCardProps {}
`,
    extension: `.types.ts`
});
