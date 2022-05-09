import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DGlobe from './ADT3DGlobe';
import { MockAdapter } from '../../Adapters';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { GlobeTheme } from '../../Models/Constants';
import { Dropdown, IDropdownOption } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '100%' };

export default {
    title: '3DV/ADT3DGlobe',
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const Globe = () => {
    const authenticationParameters = useAuthParams();
    const [theme, setTheme] = useState(GlobeTheme.Blue);

    const options: IDropdownOption[] = [];
    options.push({
        key: '1',
        text: 'Blue',
        data: GlobeTheme.Blue,
        selected: true
    });

    options.push({
        key: '2',
        text: 'Yellow',
        data: GlobeTheme.Yellow,
        selected: false
    });

    options.push({
        key: '3',
        text: 'Grey',
        data: GlobeTheme.Grey,
        selected: false
    });

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <ADT3DGlobe
                title="Globe"
                adapter={new MockAdapter()}
                globeTheme={theme}
            />
            <Dropdown
                style={{ position: 'absolute', top: 20, left: 20, width: 100 }}
                options={options}
                onChange={(e, option) => setTheme(option.data)}
            />
        </div>
    );
};
