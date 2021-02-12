import React from 'react';
import { render } from '@testing-library/react';
import LKVProcessGraphicCardCreate from './LKVProcessGraphicCardCreate';
import { LKVProcessGraphicCardCreateProps } from './LKVProcessGraphicCardCreate.types';

describe('LKVProcessGraphicCardCreate', () => {
    let props: LKVProcessGraphicCardCreateProps;
    const renderComponent = () => render(<LKVProcessGraphicCardCreate {...props} />);
    it('should render empty div', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('LKVProcessGraphicCardCreate');
        expect(component).toBeEmptyDOMElement();
    });
});
