import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams.js';
import DataPusherCard from './DataPusherCard';

export default {
    title: 'Data pusher/Data Pusher'
};

const wrapperStyle = {
    height: '500px',
    width: '100%'
};

export const DataPusher = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <DataPusherCard theme={theme} locale={locale} />
        </div>
    );
};
