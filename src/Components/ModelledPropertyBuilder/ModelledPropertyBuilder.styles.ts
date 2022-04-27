import { memoizeFunction, mergeStyleSets, IStyle } from '@fluentui/react';

export const modelledPropertyBuilderClassPrefix = 'cb-modelledpropertybuilder';

const classNames = {
    foo: `${modelledPropertyBuilderClassPrefix}-foo`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        foo: [classNames.foo, {} as IStyle]
    });
});
