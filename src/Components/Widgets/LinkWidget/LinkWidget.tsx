import React from 'react';
import { performSubstitutions } from '../Widget.Utils';

interface IProp {
    config: any;
    twins: any;
}

export const LinkWidget: React.FC<IProp> = ({ config, twins }) => {
    let expression = config.expression as string;
    expression = performSubstitutions(expression, twins);
    return (
        <a href={expression} target="_blank">
            {expression}
        </a>
    );
};
