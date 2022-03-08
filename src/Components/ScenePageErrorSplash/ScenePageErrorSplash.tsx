import React from 'react';
import { ScenePageErrorSplashProps } from './ScenePageErrorSplash.types';
import './ScenePageErrorSplash.scss';
import {
    ImageFit,
    Image,
    MessageBar,
    MessageBarType,
    IImageProps
} from '@fluentui/react';
import Error from '../../Resources/Static/error.svg';
import AccessRestrictedError from '../../Resources/Static/accessRestricted.svg';

const ScenePageErrorSplash: React.FC<ScenePageErrorSplashProps> = ({
    imageName: string,
    errorHeader,
    errorMessage
}) => {
    const imageProps: IImageProps = {
        imageFit: ImageFit.centerCover,
        height: 300
    };
    let imageAsset;
    switch (imageName) {
        case ErrorImages.AccessRestricted:
            imageAsset = AccessRestrictedError;
            break;
    }

    return (
        <div
            className="cb-scene-error-wrapper"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <Image
                className="cb-scene-error-image"
                shouldStartVisible={true}
                src={imageAsset}
                {...imageProps}
            />
            <p className="error-title">{t('NonExistentBlobErrorTitle')}</p>
            <p className="error-message">{t('NonExistentBlobErrorMessage')}</p>
        </div>
    );
};

export default ScenePageErrorSplash;
