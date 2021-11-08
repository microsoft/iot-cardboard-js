import React from 'react';
import BaseCard from '../../Base/Consume/BaseCard';
import { SceneListCardProps } from './SceneListCard.types';
import './SceneListCard.scss';
import { useAdapter } from '../../../Models/Hooks';

const SceneListCard: React.FC<SceneListCardProps> = ({
    title,
    theme,
    adapter
}) => {
    const scenes = useAdapter({
        adapterMethod: () =>
            adapter.getADTTwinsByModelId({
                modelId: 'dtmi:com:visualontology:scenee;1'
            }),
        refetchDependencies: []
    });

    return (
        <BaseCard
            isLoading={scenes.isLoading && scenes.adapterResult.hasNoData()}
            theme={theme}
            title={title}
            adapterResult={scenes.adapterResult}
        >
            <div data-testid="SceneListCard">{JSON.stringify(scenes)}</div>
        </BaseCard>
    );
};

export default SceneListCard;
