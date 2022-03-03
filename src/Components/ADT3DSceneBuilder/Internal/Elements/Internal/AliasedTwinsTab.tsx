import React from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';

interface AliasedTwinsTabProps {
    elementToEdit: ITwinToObjectMapping;
}
const AliasedTwinsTab: React.FC<AliasedTwinsTabProps> = () => {
    const { t } = useTranslation();

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            <div className={commonPanelStyles.formTabContents}>
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.notImplemented')}
                </div>
            </div>
        </>
    );
};
export default AliasedTwinsTab;
