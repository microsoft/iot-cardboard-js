module.exports = (componentName) => ({
    content: `import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
    import { IExtendedTheme } from '../../Theming/Theme.types';

    export interface I${componentName}Props {
        /**
         * Call to provide customized styling that will layer on top of the variant rules.
         */
        styles?: IStyleFunctionOrObject<I${componentName}StyleProps, I${componentName}Styles>;
    }
    
    export interface I${componentName}StyleProps {
        theme: IExtendedTheme;
    }
    export interface I${componentName}Styles {
        root: IStyle;
    
        /**
         * SubComponent styles.
         */
        subComponentStyles?: I${componentName}SubComponentStyles;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface I${componentName}SubComponentStyles {}
    
`,
    extension: `.types.ts`
});
