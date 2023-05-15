import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IDiagramProps, TDiagramAnnotationPlacement } from './Diagram.types';
import { useClassNames } from './Diagram.styles';
import { Image, Spinner, SpinnerSize } from '@fluentui/react';
import Annotation from './Internal/Annotation/Annotation';
import { PID_EXTRACTED_PROPERTIES } from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import { useId } from '@fluentui/react-components';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Diagram', debugLogging);

const CONFIDENCE_TRESHOLD = 0.8;
const ANNOTATION_X_PADDING = 38;

const Diagram: React.FC<IDiagramProps> = (props) => {
    const { parentRef, imageUrl, annotations } = props;

    // state
    const [isReady, setIsReady] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imgWidth, setImgWidth] = useState('0');
    const [imgHeight, setImgHeight] = useState('0');
    const [annotationPlacements, setAnnotationPlacements] = useState<
        Array<TDiagramAnnotationPlacement>
    >([]);

    // hooks
    const { t } = useTranslation();
    const imageOriginalDimensionRef = useRef<{ width: number; height: number }>(
        null
    );
    const annotationContainerId = useId('annotation-container');

    // side-effects
    useEffect(() => {
        if (isImageLoaded) {
            // check the proportion of widths and heights of the parent and the original image and scale to the largest dimension and keep the original proportion to fit its content
            if (
                parentRef.current.clientWidth /
                    imageOriginalDimensionRef.current.width >
                parentRef.current.clientHeight /
                    imageOriginalDimensionRef.current.height
            ) {
                setImgHeight('100%');
                setImgWidth('fit-content');
            } else {
                setImgHeight('fit-content');
                setImgWidth('100%');
            }

            setAnnotationPlacements(
                annotations.reduce((acc, a) => {
                    if (
                        !a.values[PID_EXTRACTED_PROPERTIES.Confidence] ||
                        (a.values[
                            PID_EXTRACTED_PROPERTIES.Confidence
                        ] as number) >= CONFIDENCE_TRESHOLD
                    ) {
                        acc.push({
                            ...a,
                            left: `calc(${
                                ((a.values[
                                    PID_EXTRACTED_PROPERTIES.X
                                ] as number) /
                                    imageOriginalDimensionRef.current.width) *
                                100
                            }% - ${ANNOTATION_X_PADDING}px)`,
                            top: `${
                                ((a.values[
                                    PID_EXTRACTED_PROPERTIES.Y
                                ] as number) /
                                    imageOriginalDimensionRef.current.height) *
                                100
                            }%`
                        });
                    }
                    return acc;
                }, [])
            );
            setIsReady(true);
        }
    }, [annotations, isImageLoaded, parentRef]);

    // callbacks
    const handleOnImgLoad = useCallback(({ target: image }) => {
        imageOriginalDimensionRef.current = {
            width: image.naturalWidth,
            height: image.naturalHeight
        };
        setIsImageLoaded(true);
    }, []);

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div
            className={classNames.root}
            style={{
                width: !isReady ? '100%' : imgWidth,
                height: !isReady ? '100%' : imgHeight
            }}
        >
            {!isReady && (
                <Spinner
                    className={classNames.spinnerWrapper}
                    size={SpinnerSize.medium}
                    label={t('loading')}
                />
            )}
            <Image
                width={imgWidth}
                height={imgHeight}
                onLoad={handleOnImgLoad}
                src={imageUrl}
            />
            {annotationPlacements.map((a, idx) => (
                <div
                    key={`${annotationContainerId}-${idx}`}
                    className={classNames.annotationWrapper}
                    style={{
                        left: a.left,
                        top: a.top
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
