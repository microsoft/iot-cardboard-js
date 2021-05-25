import BaseCard from '../../Base/Consume/BaseCard';
import { BIMViewerCardProps } from './BIMViewerCard.types';
import './BIMViewerCard.scss';
import { useAdapter } from '../../../Models/Hooks';
import BIMViewer from '../../../Components/BIMViewer/BIMViewer';
import React from 'react';
import {
    ADTModel_BimFilePath_PropertyName,
    ADTModel_MetadataFilePath_PropertyName
} from '../../../Models/Constants';

const properties = [
    ADTModel_BimFilePath_PropertyName,
    ADTModel_MetadataFilePath_PropertyName
];

const BIMViewerCard: React.FC<BIMViewerCardProps> = ({
    adapter,
    id,
    title,
    localeStrings,
    theme,
    centeredObject
}) => {
    const cardState = useAdapter({
        adapterMethod: () => adapter.getKeyValuePairs(id, properties, {}),
        refetchDependencies: [id, properties],
        isLongPolling: false,
        pollingIntervalMillis: null
    });

    return (
        <BaseCard
            adapterResult={cardState.adapterResult}
            isLoading={cardState.isLoading}
            theme={theme}
            title={title}
            localeStrings={localeStrings}
        >
            {cardState.adapterResult?.getData() && (
                <BIMViewer
                    bimFilePath={cardState.adapterResult?.getData()[0].value}
                    metadataFilePath={
                        cardState.adapterResult?.getData()[1].value
                    }
                    centeredObject={centeredObject}
                ></BIMViewer>
            )}
        </BaseCard>
    );
};

export default BIMViewerCard;
