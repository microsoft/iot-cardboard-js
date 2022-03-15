import React, { useState } from 'react';
import ValueRangeBuilder, { defaultSwatchColors } from './ValueRangeBuilder';

export default {
    title: 'Components/Value Range Builder',
    component: ValueRangeBuilder
};

const wrapperStyle = { width: '340px', height: '400px' };

const Template = (args, { globals: { theme, locale } }) => {
    const [valueRanges, setValueRanges] = useState(
        args.initialValueRanges || []
    );

    return (
        <div style={wrapperStyle}>
            <ValueRangeBuilder
                {...args}
                valueRanges={valueRanges}
                setValueRanges={setValueRanges}
                baseComponentProps={{ theme, locale }}
            />
        </div>
    );
};

export const Empty = Template.bind({});

export const ValueRangesPresent = Template.bind({});

ValueRangesPresent.args = {
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
