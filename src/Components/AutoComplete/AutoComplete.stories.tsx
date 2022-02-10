import React from 'react';
import { AutoComplete } from './AutoComplete';
import { Intellisense } from './Intellisense';

export default {
    title: 'AutoComplete/Consume'
};

export const SimpleAutoComplete = () => {
    return (
        <div style={{ width: '100%', padding: 40, alignItems: 'center' }}>
            <AutoComplete
                textFieldProps={{
                    placeholder: 'Search',
                    underlined: true,
                    styles: {
                        root: { width: 600 },
                        fieldGroup: { background: '#fcfcfc' }
                    }
                }}
                items={['Apple', 'Oranges', 'Pears']}
            />
        </div>
    );
};

function getPropertyNames(alias: string) {
    if (alias.toLowerCase() === 'alias1' || alias.toLowerCase() === 'alias2') {
        return [
            'AliasProperty1',
            'AliasProperty2',
            'AliasProperty3',
            'AliasProp'
        ];
    } else if (alias.toLowerCase() === 'linkedtwin') {
        return ['Temperature', 'Pressure', 'Humidity'];
    } else {
        return [];
    }
}

export const OneLineIntellisense = () => {
    return (
        <div style={{ width: '600', padding: 40, alignItems: 'center' }}>
            <Intellisense
                aliasNames={['LinkedTwin', 'Alias1', 'Alias2']}
                getPropertyNames={getPropertyNames}
            />
        </div>
    );
};

export const MultiLineIntellisense = () => {
    return (
        <div style={{ width: '600', padding: 40, alignItems: 'center' }}>
            <Intellisense
                aliasNames={['LinkedTwin', 'Alias1', 'Alias2']}
                getPropertyNames={getPropertyNames}
                autoCompleteProps={{
                    textFieldProps: { multiline: true, rows: 30 }
                }}
            />
        </div>
    );
};
