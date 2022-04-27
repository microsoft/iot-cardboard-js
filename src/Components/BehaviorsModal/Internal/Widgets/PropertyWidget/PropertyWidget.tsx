import { useTheme } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { parseExpression } from '../../../../../Models/Services/Utils';
import { IPropertyWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getStyles } from './PropertyWidget.styles';

const valuePlaceholder = '123.4';
interface IProp {
    widget: IPropertyWidget;
}

export const PropertyWidget: React.FC<IProp> = ({ widget }) => {
    const theme = useTheme();

    const { twins } = useContext(BehaviorsModalContext);
    const { displayName, valueExpression } = widget.widgetConfiguration;

    const expressionValue = useMemo(
        () => parseExpression(valueExpression, twins), // TODO: for now it is simple twin property dropdown, change this with Cory's dropdown and add logic to set the type of the property
        [valueExpression, twins]
    );
    const styles = getStyles(theme);
    return (
        <div className={styles.container}>
            <span className={styles.expressionValue} title={expressionValue}>
                {expressionValue || valuePlaceholder}
            </span>
            <span className={styles.displayName} title={displayName}>
                {displayName}
            </span>
        </div>
    );
};
