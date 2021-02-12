import React from 'react';
import { render } from '@testing-library/react';
import LKVProcessGraphicCard from './LKVProcessGraphicCard';
import { LKVProcessGraphicCardProps } from './LKVProcessGraphicCard.types';

describe('LKVProcessGraphicCard', () => {
    let props: LKVProcessGraphicCardProps;
    const renderComponent = () => render(<LKVProcessGraphicCard {...props} />);
    it('should render empty div', () => {
        const { getByTestId } = renderComponent();
        const component = getByTestId('LKVProcessGraphicCard');
        expect(component).toBeEmptyDOMElement();
    });
});
