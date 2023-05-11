import React, { useMemo } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IDiagramProps } from './Diagram.types';
import { useClassNames } from './Diagram.styles';
import { Image } from '@fluentui/react';
import Annotation from './Internal/Annotation/Annotation';
import { PID_EXTRACTED_PROPERTIES } from '../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Diagram', debugLogging);

const CONFIDENCE_TRESHOLD = 0.8;
const ANNOTATION_X_PADDING = 42;

const Diagram: React.FC<IDiagramProps> = (props) => {
    const { imageUrl, annotations } = props;

    // hooks
    const confidentAnnotations = useMemo(
        () =>
            annotations.filter((a) =>
                a.values[PID_EXTRACTED_PROPERTIES.Confidence]
                    ? a.values[PID_EXTRACTED_PROPERTIES.Confidence] >=
                      CONFIDENCE_TRESHOLD
                    : a
            ),
        [annotations]
    );

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Image styles={{ root: { overflow: 'unset' } }} src={imageUrl} />
            {confidentAnnotations.map((a) => (
                <div
                    className={classNames.annotationWrapper}
                    style={{
                        left:
                            a.values[PID_EXTRACTED_PROPERTIES.X] -
                            ANNOTATION_X_PADDING,
                        top: a.values[PID_EXTRACTED_PROPERTIES.Y]
                    }}
                >
                    <Annotation
                        text={a.friendlyName}
                        isNew={a.isNew}
                        icon={a.type.icon}
                        color={a.type.color}
                    />
                </div>
            ))}
        </div>
    );
};

export default Diagram;
