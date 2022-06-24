import React from 'react';
import { useTranslation } from 'react-i18next';
import IllustrationMessage from '../../IllustrationMessage/IllustrationMessage';
import NetworkErrorImg from '../../../Resources/Static/corsError.svg';
import GenericErrorImg from '../../../Resources/Static/noResults.svg';

interface LoadingErrorMessageProps {
    errorType: 'generic' | 'network';
}

export const LoadingErrorMessage: React.FC<LoadingErrorMessageProps> = ({
    errorType
}) => {
    const { t } = useTranslation();

    return (
        <IllustrationMessage
            headerText={t(
                'scenePageErrorHandling.sceneView.3dAssetLoadingErrorTitle'
            )}
            descriptionText={
                errorType === 'network'
                    ? t(
                          'scenePageErrorHandling.sceneView.3dAssetLoadingNetworkErrorMessage'
                      )
                    : t(
                          'scenePageErrorHandling.sceneView.3dAssetLoadingGenericErrorMessage'
                      )
            }
            type={'error'}
            width={'wide'}
            imageProps={{
                src:
                    errorType === 'network' ? NetworkErrorImg : GenericErrorImg,
                height: 200
            }}
            styles={{ container: { height: 'auto', flexGrow: 1 } }}
        />
    );
};
