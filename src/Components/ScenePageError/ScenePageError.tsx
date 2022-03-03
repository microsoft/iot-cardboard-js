import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './ScenePageError.scss';
import {
    Image,
    MessageBar,
    MessageBarType,
    IImageProps
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorProps } from './ScenePageError.types';
import Error from '../../Resources/Static/error.svg';
import AccessRestrictedError from '../../Resources/Static/accessRestricted.svg';
import { PrimaryButton } from '@fluentui/react';
import { Link, Text } from '@fluentui/react';
const ScenePageError: React.FC<ScenePageErrorProps> = ({
    errors,
    children
}) => {
    const { t } = useTranslation();
    const imageProps: IImageProps = {
        height: 200
    };

    let componentContent;
    switch (errors?.[0]?.type) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <div
                    className="cb-scene-page-error-splash-wrapper"
                    style={{
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Image
                        className="cb-scene-nonexistant-blob-error-image"
                        shouldStartVisible={true}
                        src={Error}
                        {...imageProps}
                    />
                    <div>
                        <Text
                            className="cb-error-title"
                            style={{
                                fontFamily: 'Segoe UI',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {t('NonExistentBlobErrorTitle')}
                        </Text>
                        <div>
                            <Text
                                className="cb-error-message"
                                style={{
                                    fontFamily: 'Segoe UI',
                                    textAlign: 'center'
                                }}
                            >
                                {t('NonExistentBlobErrorMessage')}
                                {''}
                                <Link href="#"> Learn More </Link> {''}
                            </Text>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <PrimaryButton
                                text="Try Again"
                                onClick={_tryAgainClicked}
                            ></PrimaryButton>
                        </div>
                    </div>
                </div>
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            componentContent = (
                <div
                    className="cb-scene-page-error-splash-wrapper"
                    style={{
                        margin: 'auto',
                        display: 'block',
                        flexDirection: 'column'
                    }}
                >
                    <Image
                        className="cb-acccess-restricted-error-image"
                        shouldStartVisible={true}
                        src={AccessRestrictedError}
                        {...imageProps}
                    />
                    <div>
                        <Text
                            className="cb-error-title"
                            style={{
                                fontFamily: 'Segoe UI',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {t('UnauthorizedAccessErrorTitle')}
                        </Text>
                        <div>
                            <Text
                                className="cb-error-message"
                                style={{
                                    fontFamily: 'Segoe UI',
                                    textAlign: 'center'
                                }}
                            >
                                {t('UnauthorizedAccessErrorMessage')}
                                {''}
                                <Link href="#"> Learn More </Link> {''}
                            </Text>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <PrimaryButton
                                text="Learn More"
                                onClick={_learnMoreClicked}
                            ></PrimaryButton>
                        </div>
                    </div>
                </div>
            );
            break;
        case ComponentErrorType.ReaderAccessOnly:
            componentContent = (
                <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={false}
                    onDismiss={null}
                    dismissButtonAriaLabel={t('close')}
                    className="cb-scene-page-warning-message"
                >
                    {t('ReaderAccessOnlyErrorMessage')}
                </MessageBar>
            );
            break;
        default:
            componentContent = children;
    }
    return (
        <BaseComponent containerClassName="cb-scene-page-container">
            {componentContent}
        </BaseComponent>
    );
};

function _tryAgainClicked(): void {
    alert('Clicked');
}

function _learnMoreClicked(): void {
    alert('Clicked');
}

export default React.memo(ScenePageError);
