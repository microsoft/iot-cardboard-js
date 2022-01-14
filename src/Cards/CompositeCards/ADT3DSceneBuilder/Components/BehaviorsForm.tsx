import { FontIcon } from '@fluentui/react/lib/components/Icon/FontIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { IADT3DSceneBuilderBehaviorFormProps } from '../ADT3DSceneBuilder.types';

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    builderMode,
    selectedBehavior,
    onBehaviorBackClick
}) => {
    const { t } = useTranslation();
    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <div className="cb-scene-builder-left-panel-create-form">
                <div
                    className="cb-scene-builder-left-panel-create-form-header"
                    tabIndex={0}
                    onClick={onBehaviorBackClick}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode === ADT3DSceneBuilderMode.EditElement
                            ? selectedBehavior.id
                            : t('3dSceneBuilder.newBehavior')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SceneBehaviorsForm;
