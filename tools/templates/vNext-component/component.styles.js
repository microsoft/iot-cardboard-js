
module.exports = (componentName) => ({
    content: `import {
        T${componentName}ClassNames
    } from './${componentName}.types';
    import { makeStyles } from '@fluentui/react-components';

    export const useClassNames = makeStyles<T${componentName}ClassNames>({
        root: {

        }
    })

`,
    extension: `.styles.ts`
});
