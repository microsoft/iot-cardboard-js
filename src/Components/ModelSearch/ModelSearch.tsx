import React from 'react';
import { useEffect } from 'react';

const ModelSearch = () => {
    useEffect(() => {
        const codeSearch = async () => {
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

        codeSearch();
    }, []);

    return <div>hello github world</div>;
};

export default ModelSearch;
