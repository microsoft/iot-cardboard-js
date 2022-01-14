import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    onCreateBehaviorClick: () => any;
}

const SceneBehaviors: React.FC<Props> = ({ onCreateBehaviorClick }) => {
    const { t } = useTranslation();

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                <p className="cb-scene-builder-left-panel-text">
                    {t('3dSceneBuilder.noBehaviorsText')}
                </p>
            </div>
            <PrimaryButton
                className="cb-scene-builder-create-element-button"
                onClick={() => onCreateBehaviorClick()}
                text={t('3dSceneBuilder.createBehavior')}
            />
        </div>
    );
};

export default SceneBehaviors;
