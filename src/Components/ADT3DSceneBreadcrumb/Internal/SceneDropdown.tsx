import { Dropdown, IDropdownOption, ResponsiveMode } from '@fluentui/react';
import React, { useCallback, useContext } from 'react';
import { IScene } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADT3DScenePageContext } from '../../../Pages/ADT3DScenePage/ADT3DScenePage';
import { dropdownStyles } from './SceneDropdown.styles';
import { SceneDropdownProps } from './SceneDropdown.types';

const SceneDropdown: React.FC<SceneDropdownProps> = ({ sceneId }) => {
    const scenePageContext = useContext(ADT3DScenePageContext);
    const scenes = scenePageContext.state.scenesConfig.configuration.scenes;
    const dropdownOptions: IDropdownOption<IScene>[] = scenes.map((scene) => {
        return {
            key: scene.id,
            text: scene.displayName
        };
    });
    const onChange = useCallback(
        (_e, option: IDropdownOption) => {
            scenePageContext.handleOnSceneSwap(String(option.key));
        },
        [scenePageContext]
    );

    return (
        <Dropdown
            options={dropdownOptions}
            defaultSelectedKey={sceneId}
            onChange={onChange}
            responsiveMode={ResponsiveMode.large}
            styles={dropdownStyles}
        />
    );
};

export default SceneDropdown;
