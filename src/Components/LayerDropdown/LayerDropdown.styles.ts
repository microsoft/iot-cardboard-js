import {
memoizeFunction,
mergeStyleSets,
IStyle      
} from '@fluentui/react';

export const layerDropdownClassPrefix = 'cb-layerdropdown';

const classNames = {
  foo: `${layerDropdownClassPrefix}-foo`
}

export const getStyles = memoizeFunction(() => {
  return mergeStyleSets({
    foo: [
      classNames.foo,
      {} as IStyle
    ] 
  })
})
