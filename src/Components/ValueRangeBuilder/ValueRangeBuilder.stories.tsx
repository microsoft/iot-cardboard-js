import { DefaultButton } from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { defaultSwatchColors } from '../../Theming/Palettes';
import ValueRangeBuilder from './ValueRangeBuilder';
import { IValueRangeBuilderHandle } from './ValueRangeBuilder.types';

export default {
    title: 'Components/Value Range Builder',
    component: ValueRangeBuilder
};

const wrapperStyle = { width: '340px', height: '400px' };
type ValueRangeBuilderStory = ComponentStory<typeof ValueRangeBuilder>;

const Template: ValueRangeBuilderStory = (
    args,
    { globals: { theme, locale } }
) => {
    return (
        <div style={wrapperStyle}>
            <ValueRangeBuilder
                {...args}
                initialValueRanges={args.initialValueRanges || []}
                baseComponentProps={{ theme, locale }}
            />
        </div>
    );
};

const TemplateWithValidation: ValueRangeBuilderStory = (
    args,
    { globals: { theme, locale } }
) => {
    const [areRangesValid, setAreRangesValid] = useState(true);
    const valueRangeBuilderHandleRef = useRef<IValueRangeBuilderHandle>(null);
    return (
        <div
            className={"cb-value-range-builder-template-with-validation"}
            style={wrapperStyle}
        >
            <ValueRangeBuilder
                {...args}
                initialValueRanges={args.initialValueRanges || []}
                baseComponentProps={{ theme, locale }}
                setAreRangesValid={setAreRangesValid}
                ref={valueRangeBuilderHandleRef}
            />
            <div>
                Consuming component - ranges are valid:{' '}
                {areRangesValid ? '✅' : '❌'}
            </div>
            <div style={{ marginTop: 8 }}>
                <DefaultButton
                    onClick={() => {
                        const valueRanges = valueRangeBuilderHandleRef.current.getValueRanges();
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
        </div>
    );
};

export const InfoFromConsumingComponent = TemplateWithValidation.bind(
    {}
) as ValueRangeBuilderStory;
InfoFromConsumingComponent.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: 1,
            max: 1000
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').color,
            min: 1001,
            max: 'Infinity'
        }
    ]
};

export const Empty = Template.bind({}) as ValueRangeBuilderStory;
export const ValidRanges = Template.bind({}) as ValueRangeBuilderStory;

ValidRanges.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: 1,
            max: 1000
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').color,
            min: 1001,
            max: 'Infinity'
        }
    ]
};

export const InvalidRange = Template.bind({}) as ValueRangeBuilderStory;
InvalidRange.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf141',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf178',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: 300,
            max: 100
        }
    ]
};

export const NonNumericValue = Template.bind({}) as ValueRangeBuilderStory;
NonNumericValue.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf141',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: 'asdf' as any,
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf178',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: 100,
            max: 300
        }
    ]
};

export const RangeOverlap = Template.bind({}) as ValueRangeBuilderStory;
RangeOverlap.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: 1,
            max: 'Infinity'
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf161',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: '-Infinity',
            max: 0
        },
        {
            id: '0278cd377adbc30253b0fdb6b5fcf162',
            color: defaultSwatchColors.find((c) => c.id === 'red').color,
            min: 750,
            max: 1500
        }
    ]
};

export const MinAndMaxRanges = Template.bind({}) as ValueRangeBuilderStory;

MinAndMaxRanges.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf160',
            color: defaultSwatchColors.find((c) => c.id === 'blue').color,
            min: '-Infinity',
            max: 'Infinity'
        }
    ],
    minRanges: 1,
    maxRanges: 3
};

MinAndMaxRanges.storyName = 'Min (1) and Max (3) Ranges';
