import BaseCard from '../BaseCard/BaseCard';
import { BIMViewerCardProps } from './BIMViewerCard.types';
import './BIMViewerCard.scss';
import { useAdapter } from '../../Models/Hooks';
import BIMViewer from '../../Components/BIMViewer/BIMViewer';
import React from 'react';
import {
    ADTModel_BimFilePath_PropertyName,
    ADTModel_MetadataFilePath_PropertyName,
    ADTModel_ViewData_PropertyName
} from '../../Models/Constants';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

const properties = [ADTModel_ViewData_PropertyName];

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
                    bimFilePath={
                        cardState.adapterResult?.getData()[0].value?.[
                            ADTModel_BimFilePath_PropertyName
                        ]
                    }
                    metadataFilePath={
                        cardState.adapterResult?.getData()[0].value?.[
                            ADTModel_MetadataFilePath_PropertyName
                        ]
                    }
                    centeredObject={centeredObject}
                ></BIMViewer>
            )}
        </BaseCard>
    );
};

export default withErrorBoundary(BIMViewerCard);
