
module.exports = (componentName) => ({
    content: `import {
        I${componentName}StyleProps,
        I${componentName}Styles
    } from './${componentName}.types';
    
    export const classPrefix = 'cb-${componentName.toLowerCase()}';
    const classNames = {
        root: \`\${classPrefix}-root\`
    };
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
