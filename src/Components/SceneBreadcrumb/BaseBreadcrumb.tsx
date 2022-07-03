import {
    Breadcrumb,
    IBreadcrumbItem,
    IconButton,
    IRenderFunction,
    useTheme
} from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import { breadcrumbStyles } from './SceneBreadcrumb.styles';
import { IBaseBreadcrumbProps } from './SceneBreadcrumb.types';
import SceneDropdown from './Internal/SceneDropdown';

export const BaseBreadcrumb: React.FC<IBaseBreadcrumbProps> = ({
    extraItems,
    isAtSceneRoot,
    sceneName,
    sceneId,
    classNames,
    onSceneClick,
    onCancelForm,
    onNavigate,
    onSceneChange
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
                        root: {
                            color: `${theme.palette.black} !important`,
                            background: theme.palette.white
                        }
                    }}
                />
            );
        } else if (isAtSceneRoot && scenePageContext) {
            return (
                <SceneDropdown
                    sceneId={sceneId}
                    onSceneChange={onSceneChange}
                />
            );
        } else return defaultRender(props);
    };

    const homeText = t('3dScenePage.home');
    const breadCrumbItems: IBreadcrumbItem[] = useMemo(() => {
        return [
            {
                text: homeText,
                key: 'Home',
                ...(scenePageContext && {
                    onClick: () => {
                        const navigate = () => {
                            scenePageContext.handleOnHomeClick();
                            if (onCancelForm) {
                                onCancelForm();
                            }
                        };
                        if (onNavigate) {
                            onNavigate('goToHome', () => {
                                navigate();
                            });
                        } else {
                            navigate();
                        }
                    }
                })
            },
            {
                text: sceneName || `(${t('noName')})`,
                key: 'Scene',
                ...(!isAtSceneRoot && {
                    onClick: onSceneClick
                })
            }
        ];
    }, [
        homeText,
        scenePageContext,
        sceneName,
        t,
        isAtSceneRoot,
        onSceneClick,
        onNavigate,
        onCancelForm
    ]);

    if (extraItems) {
        breadCrumbItems.push(...extraItems);
    }

    return (
        <div className={classNames.root}>
            <Breadcrumb
                className={`${classNames.breadcrumb} ${
                    isAtSceneRoot ? classNames.sceneRoot : ''
                }`}
                items={breadCrumbItems}
                overflowIndex={1}
                styles={breadcrumbStyles(theme)}
                onRenderItem={onRenderItem}
            />
        </div>
    );
};
