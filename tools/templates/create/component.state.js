module.exports = (componentName) => ({
    content: `import { Action } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import { ${componentName}State } from './${componentName}.types';

export const default${componentName}State: ${componentName}State = {};

// Using immer immutability helper: https://github.com/immerjs/immer
export const ${componentName}Reducer = produce(
    (draft: ${componentName}State, action: Action) => {
        switch (action.type) {
            default:
                return;
        }
    },
    default${componentName}State
);
`,
    extension: `.state.ts`
});
