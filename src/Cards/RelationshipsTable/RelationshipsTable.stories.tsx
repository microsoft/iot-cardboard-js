import React from 'react';
import { MockAdapter } from '../../Adapters';
import RelationshipsTable from './RelationshipsTable';

export default {
    title: 'RelationshipsTable/Consume'
};

const relationshipsOnClick = (twin, model, errors) =>
    console.log(twin, model, errors);

export const MockData = (
    args,
    { globals: { theme }, parameters: { wideCardWrapperStyle } }
) => {
    return (
        <div style={wideCardWrapperStyle}>
            <RelationshipsTable
                theme={theme}
                id={args.twinID}
                title={`Mock Relationships`}
                adapter={new MockAdapter()}
                onRelationshipClick={relationshipsOnClick}
            />
        </div>
    );
};
