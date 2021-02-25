module.exports = (componentName) => ({
    content: `import { Theme } from '../../../Models/Constants/Enums';
export interface ${componentName}Props {
    theme: Theme;
    defaultState?: ${componentName}State;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ${componentName}State {}
`,
    extension: `.types.ts`
});
