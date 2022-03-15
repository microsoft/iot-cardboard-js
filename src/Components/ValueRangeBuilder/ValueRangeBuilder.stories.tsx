import React, { useState } from 'react';
import ValueRangeBuilder from './ValueRangeBuilder';

export default {
    title: 'Components/Value Range Builder',
    component: ValueRangeBuilder
};

const Template = (args, { parameters: { defaultCardWrapperStyle } }) => {
    const [valueRanges, setValueRanges] = useState(
        args.initialValueRanges || []
    );

    return (
        <div style={defaultCardWrapperStyle}>
            <ValueRangeBuilder
                {...args}
                valueRanges={valueRanges}
                setValueRanges={setValueRanges}
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
            color: '#FF0000',
            min: '-Infinity',
            max: 100
        }
    ]
};
