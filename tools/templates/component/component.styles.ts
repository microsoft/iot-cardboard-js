
module.exports = (componentName) => ({
    content: `import { memoizeFunction, mergeStyleSets, IStyle } from '@fluentui/react';

export const ${componentName[0].toLowerCase() + componentName.slice(1)}ClassPrefix = 'cb-${componentName.toLowerCase()}';

const classNames = {
  foo: \`\${${componentName[0].toLowerCase() + componentName.slice(1)}ClassPrefix}-foo\`
}

export const getStyles = memoizeFunction(() => {
  return mergeStyleSets({
    foo: [classNames.foo, {} as IStyle] 
  })
})

`,
    extension: `.styles.ts`
});
