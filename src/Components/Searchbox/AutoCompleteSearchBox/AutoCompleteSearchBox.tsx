import {
    Callout,
    getFocusStyle,
    getTheme,
    ITheme,
    List,
    mergeStyleSets,
    PrimaryButton,
    SearchBox
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AutoCompleteSearchBox.scss';

type AutoCompleteSearchBoxProps = {
    value: string;
    onChange: (
        _event?: React.ChangeEvent<HTMLInputElement>,
        newValue?: string
    ) => any;
    onSearch?: (newVal?: string) => any;
    onClear?: () => any;
    searchIndex?: string[];
    setValue: (val: string) => any;
};

const theme: ITheme = getTheme();
const { palette, semanticColors } = theme;

const classes = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            cursor: 'pointer',
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            alignItems: 'center',
            selectors: {
                '&:hover': { background: palette.neutralLight }
            }
        }
    ],
    callout: {
        width: '100%',
        zIndex: 2
    }
});

const AutoCompleteSearchBox = ({
    value,
    onChange,
    onSearch = () => null,
    onClear = () => null,
    setValue,
    searchIndex
}: AutoCompleteSearchBoxProps) => {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isCalloutVisible, setIsCalloutVisible] = useState(false);
    const searchBoxRef = useRef(null);

    const suggest = (input: string) => {
        if (searchIndex && input.length > 0) {
            const filteredModels = searchIndex.filter(
                (item: string) =>
                    item.toLowerCase().indexOf(input.toLocaleLowerCase()) !== -1
            );
            setSuggestions(filteredModels);
            setIsCalloutVisible(true);
        }
    };

    const onRenderCell = (
        item: string,
        index: number,
        _isScrolling: boolean
    ): JSX.Element => {
        return (
            <div
                key={index}
                className={classes.itemCell}
                data-is-focusable={true}
                onClick={() => {
                    setSuggestions([]);
                    setValue(item);
                    onSearch(item);
                }}
            >
                {item}
            </div>
        );
    };

    return (
        <div className="cb-ms-auto-complete-search-box-container">
            <div className="cb-ms-auto-complete-searchbar">
                <div className="cb-ms-searchbox" id={'cb-ms-searchbox'}>
                    <SearchBox
                        autoComplete={'off'}
                        ref={searchBoxRef}
                        placeholder={t('modelSearch.placeholder')}
                        value={value}
                        onChange={(
                            event?: React.ChangeEvent<HTMLInputElement>,
                            newValue?: string
                        ) => {
                            suggest(newValue);
                            if (newValue === '') {
                                setSuggestions([]);
                            }
                            onChange(event, newValue);
                        }}
                        onSearch={onSearch}
                        onClear={() => {
                            onClear();
                            setSuggestions([]);
                        }}
                    />
                    {isCalloutVisible && (
                        <Callout
                            target={`#cb-ms-searchbox`}
                            className={classes.callout}
                            isBeakVisible={false}
                            doNotLayer={true}
                            shouldDismissOnWindowFocus={true}
                            gapSpace={0}
                            onDismiss={() => setIsCalloutVisible(false)}
                        >
                            <List
                                items={suggestions}
                                onRenderCell={onRenderCell}
                                className="cb-ms-suggestion-list"
                            />
                        </Callout>
                    )}
                </div>
                <PrimaryButton
                    text={t('search')}
                    onClick={() => onSearch()}
                    disabled={value.length === 0}
                />
            </div>
        </div>
    );
};

export default AutoCompleteSearchBox;
