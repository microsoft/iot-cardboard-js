import React from 'react';
import { ScenePageErrorSplashProps } from './ScenePageErrorSplash.types';
import './ScenePageErrorSplash.scss';
import { Image } from '@fluentui/react';

const ScenePageErrorSplash: React.FC<ScenePageErrorSplashProps> = ({
    image,
    errorHeader,
    errorMessage
}) => {
    return (
        <div className="cb-scene-error-wrapper">
            <Image shouldStartVisible={true} src={image.src} height={100} />
            <div>{errorHeader}</div>
            <div>{errorMessage}</div>
        </div>
    );
};

export default ScenePageErrorSplash;
