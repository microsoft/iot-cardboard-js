import React from 'react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { IAnnotationProps } from './Annotation.types';
import { annotationColorVar, useClassNames } from './Annotation.styles';
import TypeIcon from '../../../TypeIcon/TypeIcon';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import NewIndicator from '../../../NewIndicator/NewIndicator';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Annotation', debugLogging);

const Annotation: React.FC<IAnnotationProps> = (props) => {
    const { color, icon, text, isNew = true } = props;

    // hooks
    const theme = useExtendedTheme();

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div
            className={classNames.root}
            style={{
                [`${annotationColorVar}`]: theme.palette.blueDark
            }}
        >
            <div className={classNames.type}>
                <TypeIcon icon={icon} color={color} />
            </div>
            <span className={classNames.text}>{text}</span>
            {isNew && <NewIndicator />}
        </div>
    );
};

export default Annotation;
