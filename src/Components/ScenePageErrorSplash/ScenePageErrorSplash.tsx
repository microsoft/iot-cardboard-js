import React from 'react';
import { ScenePageErrorSplashProps } from './ScenePageErrorSplash.types';
import './ScenePageErrorSplash.scss';
import { IImageProps, Image } from '@fluentui/react';

const ScenePageErrorSplash: React.FC<ScenePageErrorSplashProps> = ({
    image,
    errorHeader,
    errorMessage
}) => {
    const imageProps: Partial<IImageProps> = {
        src: image
    };
    return (
        <div className="cb-scene-error-wrapper">
            <Image {...imageProps} />
            <div>{errorHeader}</div>
            <div>{errorMessage}</div>
        </div>
    );
};

export default ScenePageErrorSplash;
