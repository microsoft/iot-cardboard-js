import React, { useEffect, useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DViewerCard from './ADT3DViewerCard';
import MockAdapter from '../../Adapters/MockAdapter';
import mockVConfig from '../../../.storybook/test_data/vconfig-MattReworkFusionChristian.json';

export default {
    title: '3DV/ADT3DViewerCard'
};

// export const Truck = () => {
//     const authenticationParameters = useAuthParams();
//     return !authenticationParameters ? (
//         <div></div>
//     ) : (
//         <div style={{ width: '100%', height: '600px' }}>
//             <ADT3DViewerCard
//                 title="3D Viewer"
//                 adapter={
//                     new ADTAdapter(
//                         authenticationParameters.adt.hostUrl,
//                         new MsalAuthService(
//                             authenticationParameters.adt.aadParameters
//                         )
//                     )
//                 }
//                 blobAdapter={}
//                 pollingInterval={10000}
//                 twinId="TankVisual"
//                 connectionLineColor="#000"
//             />
//         </div>
//     );
// };

export const Mock = () => {
    const mockAdapter = new MockAdapter({ mockData: mockVConfig })
    const [sceneId, setSceneId] = useState(null);
    const [sceneConfig, setSceneConfig] = useState(null);

    useEffect(() => {
        mockAdapter.getScenesConfig().then((adapterResult) => {
            setSceneId(adapterResult.result.data.viewerConfiguration.scenes[0].id);
            setSceneConfig(adapterResult.result.data);
        });
    }, []);

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewerCard
                title="3D Viewer (Mock Data)"
                adapter={new MockAdapter()}
                sceneConfig={sceneConfig}
                pollingInterval={10000}
                sceneId={sceneId}
                connectionLineColor="#000"
            />
        </div>
    );
};
