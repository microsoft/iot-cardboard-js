import {
    Breadcrumb,
    Dropdown,
    IBreadcrumbItem,
    IconButton,
    IDropdownOption,
    IRenderFunction,
    ResponsiveMode,
    useTheme
} from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IScene } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import {
    breadcrumbStyles,
    dropdownStyles
} from './ADT3DSceneBreadcrumb.styles';
import {
    IBaseBreadcrumbProps,
    SceneDropdownProps
} from './ADT3DSceneBreadcrumb.types';

export const BaseBreadcrumb: React.FC<IBaseBreadcrumbProps> = ({
    extraItems,
    isAtSceneRoot,
    sceneName,
    sceneId,
    classNames,
    onSceneClick,
    onCancelForm
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const scenePageContext = useContext(ADT3DScenePageContext);
    const onRenderItem: IRenderFunction<IBreadcrumbItem> = (
        props: IBreadcrumbItem,
        defaultRender?: (props?: IBreadcrumbItem) => JSX.Element
    ) => {
        if (props.key === 'Home') {
            return (
                <IconButton
                    iconProps={{ iconName: 'Home' }}
                    onClick={props.onClick}
                    styles={{
                        root: { color: `${theme.palette.black} !important` }
                    }}
                />
            );
        } else if (isAtSceneRoot) {
            return <SceneDropdown sceneId={sceneId} />;
        } else return defaultRender(props);
    };

    let breadCrumbItems: IBreadcrumbItem[] = [
        {
            text: t('3dScenePage.home'),
            key: 'Home',
            ...(scenePageContext && {
                onClick: () => {
                    scenePageContext.handleOnHomeClick();
                    if (onCancelForm) {
                        onCancelForm();
                    }
                }
            })
        },
        {
            text: sceneName,
            key: 'Scene',
            ...(!isAtSceneRoot && {
                onClick: onSceneClick
            })
        }
    ];

    if (extraItems) {
        breadCrumbItems = breadCrumbItems.concat(extraItems);
    }

    return (
        <div className={classNames.container}>
            <Breadcrumb
                className={`${classNames.breadcrumb} ${
                    isAtSceneRoot ? classNames.root : ''
                }`}
                items={breadCrumbItems}
                overflowIndex={1}
                styles={breadcrumbStyles}
                onRenderItem={onRenderItem}
            />
        </div>
    );
};

const SceneDropdown: React.FC<SceneDropdownProps> = ({ sceneId }) => {
    const scenePageContext = useContext(ADT3DScenePageContext);
    const scenes = scenePageContext.state.scenesConfig.configuration.scenes;
    const dropdownOptions: IDropdownOption<IScene>[] = scenes.map((scene) => {
        return {
            key: scene.id,
            text: scene.displayName
        };
    });
    const onChange = (_e, option: IDropdownOption) => {
        const newScene = scenes.find((s) => s.id === option.key);
        scenePageContext.handleOnSceneSwap(newScene);
    };

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
