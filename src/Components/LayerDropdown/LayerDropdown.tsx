import React from 'react';
import { LayerDropdownProps } from './LayerDropdown.types';
import { getStyles } from './LayerDropdown.styles';

const LayerDropdown: React.FC<LayerDropdownProps> = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const styles = getStyles();

    return (
        <div>Hello LayerDropdown!</div>
    );
};

export default LayerDropdown;
