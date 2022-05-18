import { IconButton, IProcessedStyleSet } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ITutorialModalStyles } from '../TutorialModal.types';

const SlideStatusIndicator: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
    numSlides: number;
}> = ({ slideNumber, setSlideNumber, classNames, numSlides }) => {
    const { t } = useTranslation();
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
