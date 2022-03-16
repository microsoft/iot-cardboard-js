import { PrimaryButton } from '@fluentui/react';
import React, { useState } from 'react';
import ValueRangeBuilder from './ValueRangeBuilder';
import { defaultSwatchColors } from './ValueRangeBuilder.state';

export default {
    title: 'Components/Value Range Builder',
    component: ValueRangeBuilder
};

const wrapperStyle = { width: '340px', height: '400px' };

const Template = (args, { globals: { theme, locale } }) => {
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

const TemplateWithValidation = (args, { globals: { theme, locale } }) => {
    const [areRangesValid, setAreRangesValid] = useState(true);
    return (
        <div
            className="cb-value-range-builder-template-with-validation"
            style={wrapperStyle}
        >
            <ValueRangeBuilder
                {...args}
                initialValueRanges={args.initialValueRanges || []}
                baseComponentProps={{ theme, locale }}
                setAreRangesValid={setAreRangesValid}
            />
            <div>
                Consuming component - ranges are valid:{' '}
                {areRangesValid ? '✅' : '❌'}
            </div>
        </div>
    );
};

export const InfoFromConsumingComponent = TemplateWithValidation.bind({});
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

export const Empty = Template.bind({});
export const ValidRanges = Template.bind({});

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

export const InvalidRange = Template.bind({});
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

export const NonNumericValue = Template.bind({});
NonNumericValue.args = {
    initialValueRanges: [
        {
            id: '0278cd377adbc30253b0fdb6b5fcf141',
            color: defaultSwatchColors.find((c) => c.id === 'green').color,
            min: 'asdf',
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

export const RangeOverlap = Template.bind({});
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
