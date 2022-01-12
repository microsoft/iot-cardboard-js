import React from 'react';
import { useTranslation } from 'react-i18next';

const SceneBehaviors: React.FC<any> = () => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="cb-scene-builder-left-panel-text">
                {t('3dSceneBuilder.noBehaviorsText')}
            </p>
        </div>
    );
};

export default SceneBehaviors;
