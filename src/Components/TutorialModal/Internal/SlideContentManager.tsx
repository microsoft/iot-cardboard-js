import React from 'react';
import IllustrationPage from './IllustrationPage';
import Slide1Svg from '../../../Resources/Static/freSlide1.svg';
import Slide2Svg from '../../../Resources/Static/freSlide2.svg';
import Slide3Svg from '../../../Resources/Static/freSlide3.svg';

import { IProcessedStyleSet } from '@fluentui/react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const SlideContentManager: React.FC<{
    activeSlide: number;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ activeSlide, classNames }) => {
    let page = null;

    switch (activeSlide) {
        case 0:
            page = (
                <IllustrationPage
                    svgSrc={Slide1Svg}
                    title="Our newest low-code builder"
                    text="In this immersive 3D environment, you can monitor, diagnose, and investigate operational data with the visual context of 3D assets, powered by Azure Digital Twins data, without the need for 3D expertise."
                    classNames={classNames}
                />
            );
            break;
        case 1:
            page = (
                <IllustrationPage
                    svgSrc={Slide2Svg}
                    title="Customize your scene in our Builder"
                    text="The builder in 3D Scenes Studio is the primary interface for configuring your scenes. It is a low-code, visual experience."
                    classNames={classNames}
                />
            );
            break;
        case 2:
            page = (
                <IllustrationPage
                    svgSrc={Slide3Svg}
                    title="Explore around, or embed it elsewhere"
                    text="View the 3D scene right here in the Studio. The viewer component can be embedded into custom applications, and can work in conjunction with 3rd party components."
                    classNames={classNames}
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
