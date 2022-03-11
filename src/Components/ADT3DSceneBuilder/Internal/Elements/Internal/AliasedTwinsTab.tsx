import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

interface AliasedTwinsTabProps {
    elementToEdit: ITwinToObjectMapping;
}
const AliasedTwinsTab: React.FC<AliasedTwinsTabProps> = () => {
    const { t } = useTranslation();

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            <div className={commonPanelStyles.noDataText}>
                {t('3dSceneBuilder.notImplemented')}
            </div>
        </>
    );
};
export default AliasedTwinsTab;
