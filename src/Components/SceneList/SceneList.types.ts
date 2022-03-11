import { IButtonProps } from '@fluentui/react';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IBlobAdapter,
    IStandaloneConsumeCardProps
} from '../../Models/Constants/Interfaces';
import { IScene } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface SceneListProps extends IStandaloneConsumeCardProps {
    adapter: IBlobAdapter | MockAdapter;
    additionalActions?: Array<IButtonProps>;
    onSceneClick?: (scene: IScene) => void;
}
