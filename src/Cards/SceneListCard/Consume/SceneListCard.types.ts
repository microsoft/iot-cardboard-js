import { IButtonProps } from '@fluentui/react';
import MockAdapter from '../../../Adapters/MockAdapter';
import { IScene } from '../../../Models/Classes/3DVConfig';
import {
    IBlobAdapter,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IBlobAdapter | MockAdapter;
    additionalActions?: Array<IButtonProps>;
    onSceneClick?: (scene: IScene) => void;
}
