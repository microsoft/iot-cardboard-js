import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import useLogger from '../../Models/Hooks/useLogger';
import { LogLevel } from '../../Models/Services/LoggingService/LoggingService.types';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '100vh', padding: 20 };

export default {
    title: 'Test Stories/Logging',
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const logLevels: LogLevel[] = ['debug', 'error', 'info', 'warn'];

export const LoggingTests = () => {
    const [isEnabled, setIsEnabled] = useState(true);

    const { loggingService } = useLogger({
        context: 'Logging test story',
        enabled: isEnabled
    });

    return (
        <Stack tokens={{ childrenGap: 8 }} styles={{ root: { maxWidth: 400 } }}>
            <PrimaryButton onClick={() => setIsEnabled((prev) => !prev)}>
                {isEnabled ? 'Disable logging' : 'Enable logging'}
            </PrimaryButton>
            {logLevels.map((level, idx) => (
                <DefaultButton
                    key={idx}
                    onClick={() =>
                        loggingService.log(level, `Logging ${level} message`, {
                            testKey: 'testValue'
                        })
                    }
                >
                    Log {level}
                </DefaultButton>
            ))}
        </Stack>
    );
};
