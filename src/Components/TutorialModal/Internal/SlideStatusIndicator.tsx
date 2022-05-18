import { IconButton, IProcessedStyleSet } from '@fluentui/react';
import React from 'react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const SlideStatusIndicator: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
    numSlides: number;
}> = ({ slideNumber, setSlideNumber, classNames, numSlides }) => {
    return (
        <div className={classNames.slideStatusIndicatorContainer}>
            {Array.from(Array(numSlides).keys()).map((slide) => {
                const isActiveSlide = slide === slideNumber;
                return (
                    <IconButton
                        styles={classNames.subComponentStyles.slideIndicatorButton()}
                        iconProps={{
                            iconName: isActiveSlide
                                ? 'CircleFill'
                                : 'CircleRing'
                        }}
                        ariaLabel={
                            isActiveSlide
                                ? `Slide ${slide} selected`
                                : `Select slide ${slide}`
                        }
                        onClick={() => setSlideNumber(slide)}
                    />
                );
            })}
        </div>
    );
};

export default SlideStatusIndicator;
