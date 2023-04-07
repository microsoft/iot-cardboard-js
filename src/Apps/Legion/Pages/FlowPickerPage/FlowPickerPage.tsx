import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IFlowPickerPageProps } from './FlowPickerPage.types';
import { Stack } from '@fluentui/react';
import FlowPicker from '../../Components/FlowPicker/FlowPicker';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPickerPage', debugLogging);

const FlowPickerPage: React.FC<IFlowPickerPageProps> = () => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <h2>Pick a flow</h2>
            <FlowPicker />
        </Stack>
    );
};

export default FlowPickerPage;
