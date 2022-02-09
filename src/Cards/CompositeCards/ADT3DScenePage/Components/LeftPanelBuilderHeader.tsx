import { FontIcon } from '@fluentui/react';
import React from 'react';

interface Props {
    headerText: string;
    subHeaderText: string;
    iconName: string;
}

const LeftPanelBuilderHeader: React.FC<Props> = ({
    headerText,
    subHeaderText,
    iconName
}) => {
    return (
        <div className="cb-left-panel-builder-header-container">
            <h2 className="cb-left-panel-builder-header">{headerText}</h2>
            <div className="cb-left-panel-builder-subheader">
                <FontIcon
                    iconName={iconName}
                    className="cb-left-panel-builder-subheader-icon"
                />
                <span className="cb-left-panel-builder-subheader-text">
                    {subHeaderText}
                </span>
            </div>
            <div className="cb-scene-builder-element-behaviors-spacer" />
        </div>
    );
};

export default LeftPanelBuilderHeader;
