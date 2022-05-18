import { IconButton, IProcessedStyleSet } from '@fluentui/react';
import React from 'react';
import useKeyPress from '../../../Models/Hooks/useKeyPress';
import { ITutorialModalStyles } from '../TutorialModal.types';
import SlideContentManager from './SlideContentManager';
import SlideStatusIndicator from './SlideStatusIndicator';

const IntroductionSlideShow: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ slideNumber, setSlideNumber, classNames }) => {
    const numSlides = 3;

    const prevSlide = () => setSlideNumber(Math.max(slideNumber - 1, 0));
    const nextSlide = () =>
        setSlideNumber(Math.min(slideNumber + 1, numSlides - 1));

    useKeyPress('ArrowLeft', prevSlide);
    useKeyPress('ArrowRight', nextSlide);

    return (
        <div className={classNames.slideshowContainer}>
            {slideNumber > 0 && (
                <div className={classNames.slideChangeBtnContainerLeft}>
                    <IconButton
                        styles={classNames.subComponentStyles.chevronButton()}
                        iconProps={{ iconName: 'ChevronLeft' }}
                        ariaLabel="Previous slide"
                        onClick={prevSlide}
                    />
                </div>
            )}
            {slideNumber < numSlides - 1 && (
                <div className={classNames.slideChangeBtnContainerRight}>
                    <IconButton
                        styles={classNames.subComponentStyles.chevronButton()}
                        iconProps={{ iconName: 'ChevronRight' }}
                        ariaLabel="Next slide"
                        onClick={nextSlide}
                    />
                </div>
            )}
            <SlideStatusIndicator
                slideNumber={slideNumber}
                setSlideNumber={setSlideNumber}
                numSlides={numSlides}
                classNames={classNames}
            />
            <SlideContentManager
                activeSlide={slideNumber}
                classNames={classNames}
            />
        </div>
    );
};

export default React.memo(IntroductionSlideShow);
