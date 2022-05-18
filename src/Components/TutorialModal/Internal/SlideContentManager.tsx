import React from 'react';
import IllustrationPage from './IllustrationPage';
import Slide1Svg from '../../../Resources/Static/freSlide1.svg';
import { IProcessedStyleSet } from '@fluentui/react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const SlideContentManager: React.FC<{
    activeSlide: number;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ activeSlide, classNames }) => {
    switch (activeSlide) {
        case 0:
            return (
                <IllustrationPage
                    svgSrc={Slide1Svg}
                    title="Our newest low-code builder"
                    text="In this immersive 3D environment, you can monitor, diagnose, and investigate operational data with the visual context of 3D assets, powered by Azure Digital Twins data, without the need for 3D expertise."
                    classNames={classNames}
                />
            );
            break;
        default:
            return null;
    }
};

export default SlideContentManager;
