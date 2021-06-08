import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBox, PrimaryButton } from '@fluentui/react';
import './ModelSearch.scss';

const ModelSearch = () => {
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState('');

    const onSearchChange = (
        _event?: React.ChangeEvent<HTMLInputElement>,
        newValue?: string
    ) => {
        setSearchString(newValue);
    };

    const onSearch = async () => {
        const queryString =
            'q=' +
            encodeURIComponent(
                'AAEON-BOXER-RK88 in:file language:json repo:Azure/iot-plugandplay-models'
            );
        const res = await fetch(
            `https://api.github.com/search/code?` + queryString
        );
        const json = await res.json();
        console.log(json);
    };

    return (
        <div className="cb-modelsearch-container">
            <div className="cb-ms-searchbar">
                <SearchBox
                    className="cb-ms-searchbox"
                    placeholder={t('modelSearch.placeholder')}
                    value={searchString}
                    onChange={onSearchChange}
                />
                <PrimaryButton text={t('search')} onClick={() => null} />
            </div>
        </div>
    );
};

export default ModelSearch;
