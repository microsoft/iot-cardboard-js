import React from 'react';
import LinechartCardCreate from './LinechartCardCreate';
import { LinechartCardCreateState } from './LinechartCardCreate.types';

export default {
    title: 'Linechart/Create',
    component: LinechartCardCreate // to be able to expose component props for modification in the controls panel
};

const defaultState: LinechartCardCreateState = {
    selectedPropertyNames: ['bar', 'buzz'],
    chartPropertyNames: ['bar', 'buzz']
};

export const BasicCreate = (args, { globals: { theme } }) => (
    <div
        style={{
            height: '600px',
            padding: '8px',
            width: '1000px'
        }}
    >
        <LinechartCardCreate theme={theme} propertyNames={args.propertyNames} />
    </div>
);

export const CreateWithPropertiesSelected = (args, { globals: { theme } }) => (
    <div
        style={{
            height: '600px',
            padding: '8px',
            width: '1000px'
        }}
    >
        <LinechartCardCreate
            theme={theme}
            propertyNames={['foo', 'bar', 'baz', 'buzz']}
            defaultState={defaultState}
        />
    </div>
);

BasicCreate.args = {
    propertyNames: ['foo', 'bar', 'baz', 'buzz'] // to give default values to the exposed component props
};
