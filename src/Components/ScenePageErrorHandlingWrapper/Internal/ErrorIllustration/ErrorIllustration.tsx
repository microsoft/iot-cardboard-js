import React from 'react';
import { ErrorIllustrationProps } from './ErrorIllustration.types';
import { Image, IImageProps } from '@fluentui/react';
import BlobError from '../../../../Resources/Static/error.svg';
import AccessRestrictedError from '../../../../Resources/Static/accessRestricted.svg';
import { PrimaryButton } from '@fluentui/react';
import { Text } from '@fluentui/react';
import { ErrorImages } from '../../../../Models/Constants/Enums';

const ErrorIllustration: React.FC<ErrorIllustrationProps> = ({
    imageName,
    errorTitle,
    errorMessage,
    buttonText,
    onclickAction
}) => {
    const imageProps: IImageProps = {
        height: 200
    };

    let imageAsset;
    switch (imageName) {
        case ErrorImages.AccessRestricted:
            imageAsset = AccessRestrictedError;
            break;
        case ErrorImages.BlobError:
            imageAsset = BlobError;
            break;
        default:
    }

    return (
        <div
            className="cb-scene-page-error-splash-wrapper"
            style={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Image
                className="cb-scene-error-image"
                shouldStartVisible={true}
                src={imageAsset}
                {...imageProps}
            />
            <div style={{ textAlign: 'center' }}>
                <Text
                    className="cb-error-title"
                    style={{
                        fontFamily: 'Segoe UI',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    {errorTitle}
                </Text>
                <div>
                    <Text
                        className="cb-error-message"
                        style={{
                            fontFamily: 'Segoe UI',
                            textAlign: 'center'
                        }}
                    >
                        {errorMessage}
                        {''}
                    </Text>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <PrimaryButton
                        text={buttonText}
                        onClick={onclickAction}
                    ></PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default ErrorIllustration;
