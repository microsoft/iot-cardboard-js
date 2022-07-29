import {
    classNamesFunction,
    Pivot,
    PivotItem,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageSteps } from '../../../Models/Constants/Enums';
import { getStyles } from './SceneListModeToggle.styles';
import {
    ISceneListModeToggleProps,
    ISceneListModeToggleStyleProps,
    ISceneListModeToggleStyles
} from './SceneListModeToggle.types';

const getClassNames = classNamesFunction<
    ISceneListModeToggleStyleProps,
    ISceneListModeToggleStyles
>();

const SceneListModeToggle: React.FC<ISceneListModeToggleProps> = (props) => {
    const { onListModeChange, selectedMode, styles } = props;

    /** ----- hooks ----- */
    const { t } = useTranslation();
    const classNames = getClassNames(styles, { theme: useTheme() });

    return (
        <Pivot
            className={classNames.root}
            styles={classNames.subComponentStyles.pivot}
            selectedKey={selectedMode}
            onLinkClick={(item) =>
                onListModeChange(item.props.itemKey as ADT3DScenePageSteps)
            }
        >
            <PivotItem
                itemKey={ADT3DScenePageSteps.SceneList}
                headerText={t('3dScenePage.listView')}
                itemIcon="BulletedList2"
            />
            <PivotItem
                itemKey={ADT3DScenePageSteps.Globe}
                headerText={t('3dScenePage.globeView')}
                itemIcon="Globe"
            />
        </Pivot>
    );
};

export default styled<
    ISceneListModeToggleProps,
    ISceneListModeToggleStyleProps,
    ISceneListModeToggleStyles
>(SceneListModeToggle, getStyles);
