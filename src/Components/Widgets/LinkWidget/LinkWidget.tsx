import React from 'react';
import { IControlConfiguration } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { performSubstitutions } from '../Widget.Utils';

interface IProp {
    config: IControlConfiguration;
    twins: Record<string, DTwin>;
}

export const LinkWidget: React.FC<IProp> = ({ config, twins }) => {
    let expression = config.expression;
    expression = performSubstitutions(expression, twins);
    return (
        <a href={expression} target="_blank">
            {expression}
        </a>
    );
};
