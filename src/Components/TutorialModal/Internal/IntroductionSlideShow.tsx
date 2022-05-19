import { IconButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useKeyPress from '../../../Models/Hooks/useKeyPress';
import { TutorialModalContext } from '../TutorialModal';
import SlideContentManager from './SlideContentManager';
import SlideStatusIndicator from './SlideStatusIndicator';

const IntroductionSlideShow: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
}> = ({ slideNumber, setSlideNumber }) => {
    const { t } = useTranslation();
    const { classNames } = useContext(TutorialModalContext);

    const numSlides = 3;

    const prevSlide = () => setSlideNumber(Math.max(slideNumber - 1, 0));
    const nextSlide = () =>
        setSlideNumber(Math.min(slideNumber + 1, numSlides - 1));

    useKeyPress('ArrowLeft', prevSlide);
    useKeyPress('ArrowRight', nextSlide);

    return (
        <>
            {slideNumber > 0 && (
                <div className={classNames.slideChangeBtnContainerLeft}>
                    <IconButton
                        styles={classNames.subComponentStyles.chevronButton()}
                        iconProps={{ iconName: 'ChevronLeft' }}
                        ariaLabel={t('tutorialModal.previousSlide')}
                        onClick={prevSlide}
                    />
                </div>
            )}
            {slideNumber < numSlides - 1 && (
                <div className={classNames.slideChangeBtnContainerRight}>
                    <IconButton
                        styles={classNames.subComponentStyles.chevronButton()}
                        iconProps={{ iconName: 'ChevronRight' }}
                        ariaLabel={t('tutorialModal.nextSlide')}
                        onClick={nextSlide}
                    />
                </div>
            )}
            <SlideContentManager activeSlide={slideNumber} />
            <SlideStatusIndicator
                slideNumber={slideNumber}
                setSlideNumber={setSlideNumber}
                numSlides={numSlides}
            />
        </>
    );
};

export default React.memo(IntroductionSlideShow);
