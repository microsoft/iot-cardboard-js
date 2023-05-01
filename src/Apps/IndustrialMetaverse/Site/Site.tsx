import React from 'react';
import { ISiteProps } from './Site.types';

const Site: React.FC<ISiteProps> = ({ extensionClient }) => {
    if (extensionClient) {
        return <div>Site</div>;
    } else {
        return <div>Site without client</div>;
    }
};

export default Site;
