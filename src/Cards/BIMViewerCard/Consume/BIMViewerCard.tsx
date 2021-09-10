import BaseCard from '../../Base/Consume/BaseCard';
import { BIMViewerCardProps } from './BIMViewerCard.types';
import './BIMViewerCard.scss';
import { useAdapter } from '../../../Models/Hooks';
import BIMViewer from '../../../Components/BIMViewer/BIMViewer';
import React from 'react';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

const properties = ['MediaSrc', 'AdditionalProperties'];

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
        refetchDependencies: [id],
        isLongPolling: false,
        pollingIntervalMillis: null
    });

    const getMetadataFile = (adapterResult) => {
        return JSON.parse(
            adapterResult?.getData()?.[1].value
                ? adapterResult?.getData()?.[1].value
                : '{}'
        )?.['metadataFile'];
    };

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
                    metadataFilePath={getMetadataFile(cardState.adapterResult)}
                    centeredObject={centeredObject}
                ></BIMViewer>
            )}
        </BaseCard>
    );
};

export default withErrorBoundary(BIMViewerCard);
