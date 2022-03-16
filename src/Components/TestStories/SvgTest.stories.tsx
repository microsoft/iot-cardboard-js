import React from 'react';

import { ReactComponent as AccessRestrictedComponent } from '../../Resources/Static/accessRestricted.svg';
import Error from '../../Resources/Static/error.svg';
import { Image } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

export default {
    title: 'Test stories/SvgTest',
};

const SvgTest = () => {
    const { t } = useTranslation();

    return (
        <div
            className={'cb-svg-test-wrapper'}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <h3>{t('svgTests.fluentUI')}</h3>
            <Image shouldStartVisible={true} src={Error} height={100} />
            <h3>{t('svgTests.imgTag')}</h3>
            <img src={Error} style={{ height: 100, width: 100 }} />
            <h3>{t('svgTests.reactComponent')}</h3>
            <AccessRestrictedComponent />
        </div>
    );
};

export const TestLoadingSvg = () => <SvgTest />;

TestLoadingSvg.parameters = {
    chromatic: { delay: 5000 },
};
