import {
    classNamesFunction,
    FontIcon,
    Separator,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { ADT3DSceneBuilderMode, WidgetFormMode } from '../../..';
import i18n from '../../../i18n';
import {
    CardboardIconNames,
    TwinAliasFormMode,
    VisualRuleFormMode
} from '../../../Models/Constants';
import { ITwinToObjectMapping } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    BehaviorTwinAliasFormInfo,
    ElementTwinAliasFormInfo,
    WidgetFormInfo
} from '../ADT3DSceneBuilder.types';
import { getStyles } from './LeftPanelBuilderHeader.styles';
import {
    ILeftPanelBuilderHeaderStyleProps,
    ILeftPanelBuilderHeaderStyles,
    ILeftPanelBuilderHeaderProps
} from './LeftPanelBuilderHeader.types';

const getClassNames = classNamesFunction<
    ILeftPanelBuilderHeaderStyleProps,
    ILeftPanelBuilderHeaderStyles
>();

export const getLeftPanelBuilderHeaderParamsForBehaviors = (
    widgetFormInfo: WidgetFormInfo,
    behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo,
    builderMode: ADT3DSceneBuilderMode,
    visualRuleMode: VisualRuleFormMode
) => {
    let headerText = '',
        subHeaderText = '',
        iconName: '' | CardboardIconNames;
    if (
        widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
        widgetFormInfo.mode === WidgetFormMode.EditWidget
    ) {
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            headerText = i18n.t('3dSceneBuilder.newWidget');
        } else {
            headerText = i18n.t('3dSceneBuilder.editWidget');
        }
        iconName = widgetFormInfo.widget.iconName as CardboardIconNames;
        subHeaderText = widgetFormInfo.widget.title;
    } else if (behaviorTwinAliasFormInfo) {
        if (
            behaviorTwinAliasFormInfo?.mode ===
            TwinAliasFormMode.CreateTwinAlias
        ) {
            headerText = i18n.t('3dSceneBuilder.twinAlias.new');
        } else {
            headerText = i18n.t('3dSceneBuilder.twinAlias.edit');
        }
        iconName = behaviorTwinAliasFormInfo.twinAlias?.alias
            ? 'LinkedDatabase'
            : '';
        subHeaderText = behaviorTwinAliasFormInfo.twinAlias?.alias;
    } else if (
        visualRuleMode === VisualRuleFormMode.CreateVisualRule ||
        visualRuleMode === VisualRuleFormMode.EditVisualRule
    ) {
        if (visualRuleMode === VisualRuleFormMode.CreateVisualRule) {
            headerText = i18n.t('3dSceneBuilder.visualRuleForm.new');
        } else {
            headerText = i18n.t('3dSceneBuilder.visualRuleForm.edit');
        }
    } else {
        if (builderMode === ADT3DSceneBuilderMode.CreateBehavior) {
            headerText = i18n.t('3dSceneBuilder.newBehavior');
        } else if (builderMode === ADT3DSceneBuilderMode.EditBehavior) {
            headerText = i18n.t('3dSceneBuilder.modifyBehavior');
        }
        subHeaderText = i18n.t('3dSceneBuilder.behaviorForm.formSubTitle');
    }

    return {
        headerText,
        subHeaderText,
        iconName
    };
};

export const getLeftPanelBuilderHeaderParamsForElements = (
    selectedElement: ITwinToObjectMapping,
    elementTwinAliasFormInfo: ElementTwinAliasFormInfo,
    builderMode: ADT3DSceneBuilderMode
) => {
    let headerText = '',
        subHeaderText = '',
        iconName: '' | CardboardIconNames;

    if (elementTwinAliasFormInfo) {
        if (
            elementTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
        ) {
            headerText = i18n.t('3dSceneBuilder.twinAlias.new');
        } else {
            headerText = i18n.t('3dSceneBuilder.twinAlias.edit');
        }
        iconName = elementTwinAliasFormInfo.twinAlias.alias
            ? 'LinkedDatabase'
            : '';
        subHeaderText = elementTwinAliasFormInfo.twinAlias?.alias;
    } else {
        if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
            headerText = i18n.t('3dSceneBuilder.newElement');
            subHeaderText = i18n.t('3dSceneBuilder.elementForm.formSubTitle');
        } else if (builderMode === ADT3DSceneBuilderMode.EditElement) {
            headerText = i18n.t('3dSceneBuilder.modifyElement');
            subHeaderText = selectedElement?.displayName;
            iconName = 'Shapes';
        }
    }

    return {
        headerText,
        subHeaderText,
        iconName
    };
};

const LeftPanelBuilderHeader: React.FC<ILeftPanelBuilderHeaderProps> = ({
    headerText,
    subHeaderText,
    iconName,
    styles
}) => {
    const classNames = getClassNames(styles, { theme: useTheme() });
    return (
        <>
            <Stack className={classNames.root} tokens={{ childrenGap: 8 }}>
                <h2 className={classNames.header}>{headerText}</h2>
                {(iconName || subHeaderText) && (
                    <Stack
                        horizontal
                        className={classNames.subHeader}
                        tokens={{ childrenGap: 4 }}
                        styles={classNames.subComponentStyles.subHeaderStack}
                    >
                        {iconName && (
                            <FontIcon
                                iconName={iconName}
                                className={classNames.subHeaderIcon}
                            />
                        )}
                        {subHeaderText && (
                            <span className={classNames.subHeaderText}>
                                {subHeaderText}
                            </span>
                        )}
                    </Stack>
                )}
            </Stack>
            <Separator />
        </>
    );
};

export default styled<
    ILeftPanelBuilderHeaderProps,
    ILeftPanelBuilderHeaderStyleProps,
    ILeftPanelBuilderHeaderStyles
>(LeftPanelBuilderHeader, getStyles);
