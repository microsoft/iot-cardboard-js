import React from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';

interface AliasedTwinsTabProps {
    elementToEdit: ITwinToObjectMapping;
}
const AliasedTwinsTab: React.FC<AliasedTwinsTabProps> = () => {
    const { t } = useTranslation();

    return (
        <div className="cb-scene-builder-left-panel-element-objects">
            <div className="cb-scene-builder-left-panel-text">
                {t('3dSceneBuilder.notImplemented')}
            </div>
        </div>
    );
};
export default AliasedTwinsTab;
