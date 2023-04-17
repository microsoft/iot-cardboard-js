
module.exports = (componentName) => ({
    content: `import {
        I${componentName}Styles
    } from './${componentName}.types';
    import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';

    export const getStyles = (): IProcessedStyleSet<I${componentName}Styles> => {
        return mergeStyleSets({
            root: {}
        });
    };

`,
    extension: `.styles.ts`
});
