import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DGlobe from './ADT3DGlobe';
import { MockAdapter } from '../../Adapters';

export default {
    title: '3DV/ADT3DGlobe'
};

export const Globe = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '100%' }}>
            <ADT3DGlobe title={"Globe"} adapter={new MockAdapter()} />
        </div>
    );
};
