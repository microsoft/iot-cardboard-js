import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BIMFileSelection from '../../../Components/BIMFileSelection/BIMFileSelection';
import { BIMUploadState } from '../../../Models/Constants';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import { BIMUploadCardProps } from './BIMUploadCard.types';

const ADTHierarchyWithBIMViewerCard: React.FC<BIMUploadCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();
    const [uploadState, setUploadState] = useState(
        BIMUploadState.PreProcessing
    );
    const [bimFilePath, setBimFilePath] = useState(null);
    const [metadataFilePath, setMetadataFilePath] = useState(null);

    const onFileSelection = (bimFilePath, metadataFilePath?) => {
        console.log(bimFilePath, metadataFilePath);
        setBimFilePath(bimFilePath);
        metadataFilePath && setMetadataFilePath(metadataFilePath);
        setUploadState(BIMUploadState.PreUpload);
    };

    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            {uploadState === BIMUploadState.PreProcessing && (
                <BIMFileSelection onSubmit={onFileSelection} />
            )}
            {uploadState === BIMUploadState.PreUpload && (
                <>
                    <h3>{bimFilePath}</h3>
                    <h3>{metadataFilePath}</h3>
                </>
            )}
        </BaseCompositeCard>
    );
};

export default React.memo(ADTHierarchyWithBIMViewerCard);
