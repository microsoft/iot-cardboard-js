
module.exports = (componentName) => ({
    content: `import {
        I${componentName}StyleProps,
        I${componentName}Styles
    } from './${componentName}.types';
    import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';
    
    const classPrefix = \`\${CardboardClassNamePrefix}-${componentName.toLowerCase()}\`;
    const classNames = {
        root: \`\${classPrefix}-root\`
    };

    // export const ${componentName.toUpperCase()}_CLASS_NAMES = classNames;
    export const getStyles = (
        _props: I${componentName}StyleProps
    ): I${componentName}Styles => {
        return {
            root: [classNames.root],
            subComponentStyles: {}
        };
    };

`,
    extension: `.styles.ts`
});
