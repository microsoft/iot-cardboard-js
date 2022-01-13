import React from 'react';
import { ControlConfiguration } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { performSubstitutions } from '../Widget.Utils';

interface IProp {
    config: ControlConfiguration;
    twins: Record<string, DTwin>;
}

export const LinkWidget: React.FC<IProp> = ({ config, twins }) => {
    let expression = config.expression;
    expression = performSubstitutions(expression, twins);
    return (
        <a
            href={expression}
            target="_blank"
            style={{ position: 'absolute', bottom: '-20px' }}
        >
            {expression}
        </a>
    );
};
