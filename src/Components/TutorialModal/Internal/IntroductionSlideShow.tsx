import { IconButton, IProcessedStyleSet } from '@fluentui/react';
import React from 'react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const numSlides = 3;

const IntroductionSlideShow: React.FC<{
    slideNumber: number;
    setSlideNumber: (slideNumber: number) => void;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ slideNumber, setSlideNumber, classNames }) => {
    return (
        <div className={classNames.slideshowContainer}>
            <div className={classNames.slideChangeBtnContainerLeft}>
                <IconButton
                    styles={classNames.subComponentStyles.chevronButton()}
                    iconProps={{ iconName: 'ChevronLeft' }}
                    ariaLabel="Previous slide"
                    onClick={() => setSlideNumber(Math.max(slideNumber - 1, 0))}
                    disabled={slideNumber <= 0}
                />
            </div>
            <div className={classNames.slideChangeBtnContainerRight}>
                <IconButton
                    styles={classNames.subComponentStyles.chevronButton()}
                    iconProps={{ iconName: 'ChevronRight' }}
                    ariaLabel="Next slide"
                    onClick={() =>
                        setSlideNumber(Math.min(slideNumber + 1, numSlides))
                    }
                    disabled={slideNumber >= numSlides}
                />
            </div>
        </div>
    );
};

export default React.memo(IntroductionSlideShow);
