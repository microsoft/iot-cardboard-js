import React from 'react';
import './JsonPreview.scss';

type JsonPreviewProps = {
    json: { [key: string]: any };
};

const JsonPreview = ({ json }: JsonPreviewProps) => {
    const formattedString = JSON.stringify(json, null, 2);

    return (
        <div className="cb-json-preview-container">
            <div className="cb-json-preview">
                <pre>{formattedString}</pre>
            </div>
        </div>
    );
};

export default JsonPreview;
