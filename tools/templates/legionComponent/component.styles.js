
module.exports = (componentName) => ({
    content: `import {
        I${componentName}StyleProps,
        I${componentName}Styles
    } from './${componentName}.types';

    export const getStyles = (
        _props: I${componentName}StyleProps
    ): I${componentName}Styles => {
        return {
            root: {},
            subComponentStyles: {}
        };
    };

`,
    extension: `.styles.ts`
});
