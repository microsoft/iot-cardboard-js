module.exports = (componentName) => ({
    content: `import React from 'react';
    import { classNamesFunction, styled } from '@fluentui/react';
    import { useTranslation } from 'react-i18next';
    import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
    import { getDebugLogger } from '../../Models/Services/Utils';
    import {
        I${componentName}Props,
        I${componentName}StyleProps,
        I${componentName}Styles
    } from './${componentName}.types';
    import { getStyles } from './${componentName}.styles';

    const debugLogging = false;
    const logDebugConsole = getDebugLogger('${componentName}', debugLogging);
    
    const getClassNames = classNamesFunction<
        I${componentName}StyleProps,
        I${componentName}Styles
    >();

    const LOC_KEYS = {
        key: 'Hello ${componentName}'
    };
    
    const ${componentName}: React.FC<I${componentName}Props> = (props) => {
        const { styles } = props;

        // contexts

        // state

        // hooks
        const { t } = useTranslation();

        // callbacks

        // side effects

        // styles
        const classNames = getClassNames(styles, {
            theme: useExtendedTheme()
        });
    
        logDebugConsole('debug', 'Render');

        return <div className={classNames.root}>{t(LOC_KEYS.key)}!</div>;
    };
    
    export default styled<
        I${componentName}Props,
        I${componentName}StyleProps,
        I${componentName}Styles
    >(${componentName}, getStyles);
    
`,
    extension: `.tsx`
});
