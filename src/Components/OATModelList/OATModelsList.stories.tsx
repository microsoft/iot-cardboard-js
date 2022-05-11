import React, { useReducer } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import {
    OATGraphViewerReducer,
    defaultOATEditorState
} from './OATModelList.state';

export default {
    title: 'Components/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme } }) => {
    const [dispatch] = useReducer(OATGraphViewerReducer, defaultOATEditorState);

    const elementHandler = [
        {
            '@id': 'dtmi:com:example:model0;1',
            '@type': 'Interface',
            displayName: 'Model0',
            contents: [
                {
                    '@type': 'Relationship',
                    '@id':
                        'dtmi:com:example:model0;1Relationshipdtmi:com:example:model1;1_model1;1',
                    name: 'relationship1',
                    displayName: '',
                    target: 'dtmi:com:example:model1;1'
                },
                {
                    '@type': 'Relationship',
                    '@id':
                        'dtmi:com:example:model0;1Relationshipdtmi:com:example:model2;1_model2;1',
                    name: 'relationship2',
                    displayName: '',
                    target: 'dtmi:com:example:model2;1'
                }
            ]
        },
        {
            '@id': 'dtmi:com:example:model1;1',
            '@type': 'Interface',
            displayName: 'Model1',
            contents: []
        },
        {
            '@id': 'dtmi:com:example:model2;1',
            '@type': 'Interface',
            displayName: 'Model2',
            contents: []
        }
    ];

    return (
        <BaseComponent theme={theme}>
            <OATModelList elements={elementHandler} dispatch={dispatch} />
        </BaseComponent>
    );
};
