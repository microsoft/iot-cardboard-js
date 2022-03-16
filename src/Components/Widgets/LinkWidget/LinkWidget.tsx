import React from 'react';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { ILinkWidget } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { performSubstitutions } from '../Widget.Utils';

interface IProp {
    widget: ILinkWidget;
    twins: Record<string, DTwin>;
}

export const LinkWidget: React.FC<IProp> = ({ widget, twins }) => {
    let expression = widget.widgetConfiguration.linkExpression;
    expression = performSubstitutions(expression, twins);
    return (
        <a href={expression} target={"_blank"} rel={"noreferrer"}>
            {expression}
        </a>
    );
};
