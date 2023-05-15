import React from 'react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { IAnnotationProps } from './Annotation.types';
import { annotationColorVar, useClassNames } from './Annotation.styles';
import TypeIcon from '../../../TypeIcon/TypeIcon';
import NewIcon from '../../../../../../Resources/Static/new.svg';
import { Image } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';

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
            {isNew && <Image className={classNames.newIcon} src={NewIcon} />}
        </div>
    );
};

export default Annotation;
