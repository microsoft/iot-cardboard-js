import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import {ADT3DVCard} from './ADT3DVCard';

export default {
    title: '3DV/ADT3DVCard'
};

export const Truck = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ADT3DVCard                 
                adapter={
                    new ADTAdapter(
                    authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                twinId='TankVisual'/>
        </div>
    )
};
