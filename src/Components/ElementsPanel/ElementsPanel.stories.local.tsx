import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementsPanel from './ElementsPanel';

const componentStyle = {
    height: '800px',
    width: '400px'
};

export default {
    title: 'Components/ElementsPanel',
    component: ElementsPanel
};

export const ViewerElementsPanel = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={componentStyle}>
            <ElementsPanel
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                theme={theme}
                locale={locale}
                sceneConfig={scenesConfig}
                pollingInterval={10000}
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                onItemClick={(item, meshIds) => console.log(item, meshIds)}
                onItemHover={(item) => console.log(item.type)}
            />
        </div>
    );
};
