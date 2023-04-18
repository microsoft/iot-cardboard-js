
module.exports = (componentName) => ({
    content: `import {
        I${componentName}Styles
    } from './${componentName}.types';
    import { IProcessedStyleSet, mergeStyleSets, memoizeFunction } from '@fluentui/react';

    export const getStyles = memoizeFunction((): IProcessedStyleSet<I${componentName}Styles> => {
        return mergeStyleSets({
            root: {}
        });
    });

`,
    extension: `.styles.ts`
});
