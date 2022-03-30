import React from 'react';
import { useTheme } from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';

const OATPropertyEditor = () => {
    const theme = useTheme();

    return (
        <BaseComponent theme={theme}>
            <div></div>
        </BaseComponent>
    );
};

export default OATPropertyEditor;
