import { Breadcrumb } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IBlobAdapter } from '../../Models/Constants';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import ADT3DGlobe from '../ADT3DGlobe/ADT3DGlobe';

interface IADT3DGlobeContainerProps {
    adapter: IBlobAdapter;
}
const ADT3DGlobeContainer: React.FC<IADT3DGlobeContainerProps> = (props) => {
    const { adapter } = props;
    const { t } = useTranslation();
    const { handleOnHomeClick, handleOnSceneClick } = useContext(
        ADT3DScenePageContext
    );
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        text: t('3dScenePage.home'),
                        key: 'Home',
                        onClick: handleOnHomeClick
                    },
                    {
                        text: t('3dScenePage.globe'),
                        key: 'Scene'
                    }
                ]}
                maxDisplayedItems={10}
                ariaLabel="Breadcrumb with items rendered as buttons"
                overflowAriaLabel="More links"
            />
            <ADT3DGlobe
                adapter={adapter}
                onSceneClick={(scene) => {
                    handleOnSceneClick(scene);
                }}
            />
        </>
    );
};

export default React.memo(ADT3DGlobeContainer);
