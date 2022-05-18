import { IconButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TutorialModalContext } from '../TutorialModal';

const SlideStatusIndicator: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
    numSlides: number;
}> = ({ slideNumber, setSlideNumber, numSlides }) => {
    const { t } = useTranslation();
    const { classNames } = useContext(TutorialModalContext);
    return (
        <div className={classNames.slideStatusIndicatorContainer}>
            {Array.from(Array(numSlides).keys()).map((slide) => {
                const isActiveSlide = slide === slideNumber;
                return (
                    <IconButton
                        key={slide}
                        styles={classNames.subComponentStyles.slideIndicatorButton()}
                        iconProps={{
                            iconName: isActiveSlide
                                ? 'CircleFill'
                                : 'CircleRing'
                        }}
                        ariaLabel={
                            isActiveSlide
                                ? t(
                                      'tutorialModal.statusIndicatorSelectedAria',
                                      { slide }
                                  )
                                : t(
                                      'tutorialModal.statusIndicatorUnselectedAria',
                                      { slide }
                                  )
                        }
                        onClick={() => setSlideNumber(slide)}
                    />
                );
            })}
        </div>
    );
};

export default SlideStatusIndicator;
