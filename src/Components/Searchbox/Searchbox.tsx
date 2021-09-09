import { SearchBox } from '@fluentui/react';
import React from 'react';
import { ISearchboxProps } from '../../Models/Constants/Interfaces';

const Searchbox: React.FC<ISearchboxProps> = ({
    className,
    placeholder,
    onChange,
    onSearch,
    onClear
}) => {
    return (
        <SearchBox
            className={className}
            placeholder={placeholder}
            onChange={onChange}
            onSearch={onSearch}
            onClear={onClear}
        />
    );
};

export default React.memo(Searchbox);
