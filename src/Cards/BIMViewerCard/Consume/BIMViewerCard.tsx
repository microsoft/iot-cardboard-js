import BaseCard from '../../Base/Consume/BaseCard';
import { BIMViewerCardProps } from './BIMViewerCard.types';
import './BIMViewerCard.scss';
import { useAdapter } from '../../../Models/Hooks';
import BIMViewer from '../../../Components/BIMViewer/BIMViewer';

const properties = ['bimFilePath', 'metadataFilePath'];

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
                    bimFileType="xkt" // HARDCODED - should be included in the twin definition
                    centeredObject={centeredObject}
                ></BIMViewer>
            )}
        </BaseCard>
    );
};

export default BIMViewerCard;
