module.exports = (componentName) => ({
    content: `import { IStyle } from '@fluentui/react';

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface I${componentName}Props {
    }
    
    export interface I${componentName}Styles {
        root: IStyle;
    }
    
`,
    extension: `.types.ts`
});
