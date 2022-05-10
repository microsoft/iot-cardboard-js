module.exports = (componentName) => ({
    content: `import React from 'react';
    import {
        I${componentName}Props,
        I${componentName}StyleProps,
        I${componentName}Styles
    } from './${componentName}.types';
    import { getStyles } from './${componentName}.styles';
    import { classNamesFunction, useTheme, styled } from '@fluentui/react';
    
    const getClassNames = classNamesFunction<
        I${componentName}StyleProps,
        I${componentName}Styles
    >();
    
    const ${componentName}: React.FC<I${componentName}Props> = (props) => {
        const { styles } = props;
        const classNames = getClassNames(styles, {
            theme: useTheme()
        });
    
        return <div className={classNames.root}>Hello ${componentName}!</div>;
    };
    
    export default styled<
        I${componentName}Props,
        I${componentName}StyleProps,
        I${componentName}Styles
    >(${componentName}, getStyles);
    
`,
    extension: `.tsx`
});
