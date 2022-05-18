import React, { useContext } from 'react';
import IllustrationPage from './IllustrationPage';
import Slide1Svg from '../../../Resources/Static/freSlide1.svg';
import Slide2Svg from '../../../Resources/Static/freSlide2.svg';
import Slide3Svg from '../../../Resources/Static/freSlide3.svg';
import { useTranslation } from 'react-i18next';
import { TutorialModalContext } from '../TutorialModal';

const SlideContentManager: React.FC<{
    activeSlide: number;
}> = ({ activeSlide }) => {
    const { t } = useTranslation();
    const { classNames } = useContext(TutorialModalContext);

    let page = null;

    switch (activeSlide) {
        case 0:
            page = (
                <IllustrationPage
                    svgSrc={Slide1Svg}
                    title={t('tutorialModal.frePages.intro.title')}
                    text={t('tutorialModal.frePages.intro.text')}
                />
            );
            break;
        case 1:
            page = (
                <IllustrationPage
                    svgSrc={Slide2Svg}
                    title={t('tutorialModal.frePages.builder.title')}
                    text={t('tutorialModal.frePages.builder.text')}
                />
            );
            break;
        case 2:
            page = (
                <IllustrationPage
                    svgSrc={Slide3Svg}
                    title={t('tutorialModal.frePages.viewer.title')}
                    text={t('tutorialModal.frePages.viewer.text')}
                />
            );
            break;
        default:
            break;
    }

    return (
        <div className={classNames.slideshowContainer} key={activeSlide}>
            {page}
        </div>
    );
};

export default SlideContentManager;
