import React from 'react';
import ModelCreate from './ModelCreate';

export default {
    title: 'Components/ModelCreate',
    component: ModelCreate,
    parameters: {
        backgrounds: {
            default: 'gray',
            values: [{ name: 'gray', value: '#F9F9F9' }]
        }
    }
};

const mockExistingModels = [
    'dtmi;com:example:www:door1;1',
    'dtmi;com:example:www:roof1;1',
    'dtmi;com:example:www:room1;1'
];

export const Default = (_args, { globals: { locale } }) => (
    <div style={{ maxWidth: '720px', width: '100%', height: '600px' }}>
        <ModelCreate
            locale={locale}
            existingModelIds={mockExistingModels}
            onCancel={() => console.log('Cancelling')}
            onPrimaryAction={(model) => console.log(model)}
        />
    </div>
);
