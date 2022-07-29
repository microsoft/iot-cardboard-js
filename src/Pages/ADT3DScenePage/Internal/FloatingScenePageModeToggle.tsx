import {
    classNamesFunction,
    Pivot,
    PivotItem,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import {
    IFloatingScenePageModeToggleStyleProps,
    IFloatingScenePageModeToggleStyles,
    IFloatingScenePageModeToggleProps
} from './FloatingScenePageModeToggle.types';
import { getStyles } from './FloatingScenePageModeToggle.styles';

const getClassNames = classNamesFunction<
    IFloatingScenePageModeToggleStyleProps,
    IFloatingScenePageModeToggleStyles
>();

const FloatingScenePageModeToggle: React.FC<IFloatingScenePageModeToggleProps> = (
    props
) => {
    const { handleScenePageModeChange, selectedMode, sceneId, styles } = props;
    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });

    if (!sceneId) return null;

    return (
        <div className={classNames.root}>
            <Pivot
                selectedKey={selectedMode}
                onLinkClick={(item) =>
                    handleScenePageModeChange(
                        item.props.itemKey as ADT3DScenePageModes
                    )
                }
                styles={classNames.subComponentStyles.pivot}
            >
                <PivotItem
                    headerText={t('build')}
                    itemKey={ADT3DScenePageModes.BuildScene}
                ></PivotItem>
                <PivotItem
                    headerText={t('view')}
                    itemKey={ADT3DScenePageModes.ViewScene}
                ></PivotItem>
            </Pivot>
        </div>
    );
};

export default styled<
    IFloatingScenePageModeToggleProps,
    IFloatingScenePageModeToggleStyleProps,
    IFloatingScenePageModeToggleStyles
>(FloatingScenePageModeToggle, getStyles);
