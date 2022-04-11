import { DefaultButton } from '@fluentui/react';
import React from 'react';
import { defaultSwatchColors } from '../../Theming/Palettes';
import useValueRangeBuilder from '../../Models/Hooks/useValueRangeBuilder';
import ValueRangeBuilder from './ValueRangeBuilder';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = {
    width: '100%',
    height: '500px',
    overflowY: 'auto'
} as React.CSSProperties;

export default {
    title: 'Components/Value Range Builder',
    component: ValueRangeBuilder,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const Template = (args, { globals: { theme, locale } }) => {
    const { valueRangeBuilderReducer } = useValueRangeBuilder({
        initialValueRanges: args.initialValueRanges,
        minRanges: args.minRanges,
        maxRanges: args.maxRanges
    });
    return (
        <ValueRangeBuilder
            {...args}
            valueRangeBuilderReducer={valueRangeBuilderReducer}
            baseComponentProps={{ theme, locale }}
        />
    );
};

const TemplateWithValidation = (args, { globals: { theme, locale } }) => {
    const {
        valueRangeBuilderState,
        valueRangeBuilderReducer
    } = useValueRangeBuilder({
        initialValueRanges: args.initialValueRanges,
        minRanges: args.minRanges,
        maxRanges: args.maxRanges
    });

    return (
        <>
            <div>
                Consuming component - ranges are valid:{' '}
                {valueRangeBuilderState.areRangesValid ? '✅' : '❌'}
            </div>
            <div style={{ margin: '20px 0px' }}>
                <DefaultButton
                    onClick={() => {
                        const valueRanges = valueRangeBuilderState.valueRanges;
                        alert(
                            `${valueRanges.length} value ranges were retrieved from this consuming component.  Details have been logged in the console`
                        );
                        console.log(
                            'Value ranges printed from consuming component: ',
                            valueRanges
                        );
                    }}
                >
                    Grab value ranges from parent
                </DefaultButton>
            </div>
            <ValueRangeBuilder
                {...args}
                baseComponentProps={{ theme, locale }}
                valueRangeBuilderReducer={valueRangeBuilderReducer}
            />
        </>
    );
};

export const InfoFromConsumingComponent = TemplateWithValidation.bind({});
InfoFromConsumingComponent.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').item,
            min: 1,
            max: 1000
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').item,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').item,
            min: 1001,
            max: 'Infinity'
        }
    ]
};

export const Empty = Template.bind({});
export const ValidRanges = Template.bind({});

ValidRanges.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').item,
            min: 1,
            max: 1000
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').item,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').item,
            min: 1001,
            max: 'Infinity'
        }
    ]
};

export const InvalidRange = Template.bind({});
InvalidRange.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf141',
            color: defaultSwatchColors.find((c) => c.id === 'green').item,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf178',
            color: defaultSwatchColors.find((c) => c.id === 'blue').item,
            min: 300,
            max: 100
        }
    ]
};

export const NonNumericValue = Template.bind({});
NonNumericValue.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf141',
            color: defaultSwatchColors.find((c) => c.id === 'green').item,
            min: 'asdf' as any,
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf178',
            color: defaultSwatchColors.find((c) => c.id === 'blue').item,
            min: 100,
            max: 300
        }
    ]
};

export const RangeOverlap = Template.bind({});
RangeOverlap.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').item,
            min: 1,
            max: 'Infinity'
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').item,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').item,
            min: 750,
            max: 1500
        }
    ]
};

export const MinAndMaxRanges = Template.bind({});

MinAndMaxRanges.args = {
    minRanges: 5,
    maxRanges: 10
};

MinAndMaxRanges.storyName = 'Min (5) and Max (10) Ranges';
