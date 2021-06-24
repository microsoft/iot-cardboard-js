import {
    Callout,
    FocusZone,
    FocusZoneDirection,
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
    onRenderSuggestionCell: (item: any, index: number) => JSX.Element;
    onSelectSuggestedItem: (item: any) => any;
    onSearch?: (newVal?: string) => any;
    onClear?: () => any;
    minAutocompleteChars?: number;
    searchDisabled?: boolean;
    findSuggestions: (input: string) => any;
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
    findSuggestions,
    onRenderSuggestionCell,
    onSelectSuggestedItem,
    minAutocompleteChars = 2,
    searchDisabled = false
}: AutoCompleteSearchBoxProps) => {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isCalloutVisible, setIsCalloutVisible] = useState(false);
    const searchBoxRef = useRef(null);

    const suggest = (input: string) => {
        if (findSuggestions && input.length >= minAutocompleteChars) {
            setSuggestions(findSuggestions(input));
            setIsCalloutVisible(true);
        }
    };

    const onRenderCell = (
        item: any,
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
                    onSelectSuggestedItem(item);
                }}
            >
                {onRenderSuggestionCell(item, index)}
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
                        disabled={searchDisabled}
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
                        onFocus={() => {
                            setIsCalloutVisible(true);
                        }}
                        onSearch={() => {
                            onSearch();
                            setSuggestions([]);
                        }}
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
                            <FocusZone
                                direction={FocusZoneDirection.vertical}
                                isCircularNavigation={true}
                                role="grid"
                            >
                                <List
                                    items={suggestions}
                                    onRenderCell={onRenderCell}
                                    className="cb-ms-suggestion-list"
                                />
                            </FocusZone>
                        </Callout>
                    )}
                </div>
                <PrimaryButton
                    text={t('search')}
                    onClick={() => onSearch()}
                    disabled={value.length === 0 || searchDisabled}
                />
            </div>
        </div>
    );
};

export default React.memo(AutoCompleteSearchBox);
