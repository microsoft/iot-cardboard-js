import { useTheme } from '@fluentui/react';
import { useArgs, useState } from '@storybook/addons';
import React, { useEffect } from 'react';
import { WidgetType } from '../../../../../Models/Classes/3DVConfig';
import { BehaviorModalMode } from '../../../../../Models/Constants/Enums';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import { IValueWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getWidgetClassNames } from '../WidgetsContainer.styles';
import { ValueWidget } from './ValueWidget';

const wrapperStyle = { width: '400px', height: '600px', padding: 20 };
const mockValues = {
    boolean: 'true',
    date: 'Jan 10, 2022', // A full-date as defined in section 5.6 of RFC 3339
    dateTime: '2019-10-12T07:20:50.52Z', // A date-time as defined in 5.6 of RFC 3339
    double: '123.4',
    duration: 'P3Y6M4DT12H30M5S', // A duration in ISO 8601 format
    enum: 'Active',
    float: '123.45',
    integer: '123',
    long: '123456789000000000000',
    string:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    time: '07:20:50.52Z' // A full-time as defined in section 5.6 of RFC 3339
};

export default {
    title: 'Components/ValueWidget',
    component: ValueWidget,
    args: {
        type: 'string',
        value: mockValues['string']
    },
    decorators: [
        getDefaultStoryDecorator<{ widget: IValueWidget }>(wrapperStyle)
    ]
};

const defaultValueWidget: IValueWidget = {
    id: '',
    type: WidgetType.Value,
    widgetConfiguration: {
        displayName: 'Example display name',
        valueExpression: null,
        type: null
    }
};

export const ValueWidgetWithTypes = (args) => {
    const mode = BehaviorModalMode.preview;
    const theme = useTheme();

    const [placeholderValues, setPlaceholderValues] = useState(mockValues);
    const [, updateArgs] = useArgs();

    useEffect(() => {
        defaultValueWidget.widgetConfiguration.type = args.type;
        updateArgs({ value: mockValues[args.type] }); // update the placeholder values with default/mock ones whenever the type control is set by user to provide an example
    }, [args.type]);

    useEffect(() => {
        // update the placeholder values whenever the value control is set by user
        setPlaceholderValues({ ...placeholderValues, [args.type]: args.value });
    }, [args.value]);

    return (
        <BehaviorsModalContext.Provider // needed to provide this for ValueWidget component
            value={{
                twins: {},
                mode,
                activeWidgetId: undefined
            }}
        >
            <div className={getWidgetClassNames(theme, mode, false).widget}>
                <ValueWidget
                    key={defaultValueWidget.id}
                    widget={defaultValueWidget}
                    placeholderValues={placeholderValues}
                />
            </div>
        </BehaviorsModalContext.Provider>
    );
};

ValueWidgetWithTypes.argTypes = {
    type: {
        type: 'select',
        options: [
            'boolean',
            'date',
            'dateTime',
            'double',
            'duration',
            'enum',
            'float',
            'integer',
            'long',
            'string',
            'time'
        ]
    },
    value: {
        control: {
            type: 'text'
        }
    }
};
