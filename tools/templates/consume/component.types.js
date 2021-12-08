module.exports = (componentName) => ({
    content: `import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ${componentName}Props extends IConsumeCardProps {}
`,
    extension: `.types.ts`
});
