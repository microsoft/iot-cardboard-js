import React from 'react';

const ConceptPage: React.FC<{ pageKey: string }> = ({ pageKey }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}
        >
            {pageKey}
        </div>
    );
};

export default ConceptPage;
