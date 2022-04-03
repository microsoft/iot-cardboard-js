import { FontIcon, Separator } from '@fluentui/react';
import React from 'react';
import { ADT3DSceneBuilderMode, WidgetFormMode } from '../../..';
import i18n from '../../../i18n';
import { TwinAliasFormMode } from '../../../Models/Constants';
import { TwinAliasFormInfo, WidgetFormInfo } from '../ADT3DSceneBuilder.types';

interface Props {
    headerText: string;
    subHeaderText: string | undefined;
    iconName: string | undefined;
}

export const getLeftPanelBuilderHeaderParams = (
    widgetFormInfo: WidgetFormInfo,
    twinAliasFormInfo: TwinAliasFormInfo,
    builderMode: ADT3DSceneBuilderMode
) => {
    let headerText = '',
        subHeaderText = '',
        iconName = 'Ringer';

    if (widgetFormInfo) {
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            headerText = i18n.t('3dSceneBuilder.newWidget');
        } else {
            headerText = i18n.t('3dSceneBuilder.editWidget');
        }
        iconName = '';
        subHeaderText = widgetFormInfo.widget.title;
    } else if (twinAliasFormInfo) {
        if (twinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias) {
            headerText = i18n.t('3dSceneBuilder.newTwinAlias');
        } else {
            headerText = i18n.t('3dSceneBuilder.editTwinAlias');
        }
        iconName = twinAliasFormInfo.twinAlias?.alias ? 'LinkedDatabase' : '';
        subHeaderText = twinAliasFormInfo.twinAlias?.alias;
    } else {
        if (builderMode === ADT3DSceneBuilderMode.CreateBehavior) {
            headerText = i18n.t('3dSceneBuilder.newBehavior');
        } else if (builderMode === ADT3DSceneBuilderMode.EditBehavior) {
            headerText = i18n.t('3dSceneBuilder.modifyBehavior');
        }
        subHeaderText = i18n.t('3dSceneBuilder.behaviorTypes.alertBehavior');
        iconName = 'Ringer';
    }

    return {
        headerText,
        subHeaderText,
        iconName
    };
};

const LeftPanelBuilderHeader: React.FC<Props> = ({
    headerText,
    subHeaderText,
    iconName
}) => {
    return (
        <div className="cb-left-panel-builder-header-container">
            <h2 className="cb-left-panel-builder-header">{headerText}</h2>
            {(iconName || subHeaderText) && (
                <div className="cb-left-panel-builder-subheader">
                    {iconName && (
                        <FontIcon
                            iconName={iconName}
                            className="cb-left-panel-builder-subheader-icon"
                        />
                    )}
                    {subHeaderText && (
                        <span className="cb-left-panel-builder-subheader-text">
                            {subHeaderText}
                        </span>
                    )}
                </div>
            )}
            <Separator />
        </div>
    );
};

export default LeftPanelBuilderHeader;
