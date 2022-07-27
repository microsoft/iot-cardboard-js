import React from 'react';
import { Text } from '@fluentui/react';
import './FormSection.scss';

const FormSection = ({ title, children }) => (
    <div className="cb-formsection">
        <Text variant="medium" className="cb-formsection-title">
            {title}
        </Text>
        {children}
    </div>
);

export default FormSection;
