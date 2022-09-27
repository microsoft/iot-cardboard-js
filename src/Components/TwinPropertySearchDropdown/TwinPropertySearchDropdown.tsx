import React, {
    forwardRef,
    Ref,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    Callout,
    classNamesFunction,
    DirectionalHint,
    Icon,
    Label,
    Stack,
    styled,
    Text,
    useTheme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { components, MenuProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useAdapter from '../../Models/Hooks/useAdapter';
import { AdapterMethodParamsForSearchADTTwins } from '../../Models/Constants/Types';
import {
    getDebugLogger,
    getMarkedHtmlBySearch,
    removeDuplicatesFromArray
} from '../../Models/Services/Utils';
import TooltipCallout from '../TooltipCallout/TooltipCallout';
import { IADTTwin } from '../../Models/Constants';
import { getReactSelectStyles } from '../../Resources/Styles/ReactSelect.styles';
import { getStyles } from './TwinPropertySearchDropdown.styles';
import {
    IReactSelectOption,
    ITwinPropertySearchDropdownProps,
    ITwinPropertySearchDropdownStyleProps,
    ITwinPropertySearchDropdownStyles,
    PropertyValueHandle
} from './TwinPropertySearchDropdown.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TwinSearchDropdown', debugLogging);

const getClassNames = classNamesFunction<
    ITwinPropertySearchDropdownStyleProps,
    ITwinPropertySearchDropdownStyles
>();
const createOption = (value: string) => ({ value: value, label: value });

const SuggestionListScrollThresholdFactor = 40;
/**
 * Component to search the twins graph and show all possible values for a particular property name across all twins in the graph.
 * Whatever property name is provided will be searched on the graph and return the distinct list of values for that property
 * @param param0 props
 * @returns a component
 */
const TwinPropertySearchDropdown = (
    props: ITwinPropertySearchDropdownProps,
    ref: Ref<PropertyValueHandle>
) => {
    const {
        adapter,
        descriptionText,
        initialSelectedValue,
        inputStyles,
        isLabelHidden = false,
        label,
        labelIconName,
        labelTooltip,
        onChange,
        noOptionsText,
        placeholderText,
        resetInputOnBlur = true,
        searchPropertyName,
        styles
    } = props;
    const { t } = useTranslation();
    const selectId = useId('twin-property-search-dropdown');
    const [searchValue, setSearchValue] = useState(initialSelectedValue ?? '');
    const [dropdownOptions, setDropdownOptions] = useState<
        IReactSelectOption[]
    >(initialSelectedValue ? [createOption(initialSelectedValue)] : []);

    const [selectedOption, setSelectedOption] = useState(
        initialSelectedValue ? createOption(initialSelectedValue) : null
    );

    const theme = useTheme();
    const selectDropdownElement = document.getElementById(selectId);
    const dropdownWidth = (selectDropdownElement?.offsetWidth || 102) - 2; // account for borders
    // Classname after state to track row #
    const classNames = getClassNames(styles, {
        theme: theme,
        menuWidth: dropdownWidth
    });
    const selectStyles = useMemo(
        () => inputStyles || getReactSelectStyles(theme),
        [theme, inputStyles]
    );

    const shouldAppendOptions = useRef(false);
    const twinSearchContinuationToken = useRef(null);
    const lastScrollTopRef = useRef(0);
    const twinSuggestionListRef = useRef<HTMLDivElement>();

    const searchTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchADTTwins) =>
            adapter.searchADTTwins(params),
        refetchDependencies: [searchPropertyName],
        isAdapterCalledOnMount: false
    });

    useEffect(() => {
        if (searchTwinAdapterData.adapterResult?.result?.data) {
            let options: IReactSelectOption[] = [];
            if (shouldAppendOptions.current) {
                options = dropdownOptions.concat(
                    searchTwinAdapterData.adapterResult.result.data.value.map(
                        (t: IADTTwin) => createOption(t[searchPropertyName])
                    )
                );
            } else {
                options = searchTwinAdapterData.adapterResult.result.data.value.map(
                    (t: IADTTwin) => createOption(t[searchPropertyName])
                );
            }

            // add in the currently selected option if it's freeform
            if (
                options &&
                selectedOption &&
                !options?.some((x) => x.value === selectedOption?.value)
            ) {
                options.unshift(selectedOption);
            }

            // remove any duplicate entries
            options = removeDuplicatesFromArray(options, 'label');
            setDropdownOptions(options || []);

            twinSearchContinuationToken.current =
                searchTwinAdapterData.adapterResult.result.data.continuationToken;
        }
    }, [searchTwinAdapterData.adapterResult, selectedOption]);

    useEffect(() => {
        if (lastScrollTopRef.current && !searchTwinAdapterData.isLoading) {
            (twinSuggestionListRef.current as HTMLDivElement).scrollTop =
                lastScrollTopRef.current;
            lastScrollTopRef.current = 0;
        }
    }, [twinSuggestionListRef.current]);

    const handleOnScroll = (event) => {
        const divElement = event.currentTarget as HTMLDivElement;
        if (
            divElement.scrollHeight - divElement.scrollTop <=
            divElement.clientHeight + SuggestionListScrollThresholdFactor
        ) {
            if (twinSearchContinuationToken.current) {
                lastScrollTopRef.current = divElement.scrollTop;
                shouldAppendOptions.current = true;
                searchTwinAdapterData.callAdapter({
                    searchProperty: searchPropertyName,
                    searchTerm: searchValue,
                    shouldSearchByModel: false,
                    continuationToken: twinSearchContinuationToken.current
                } as AdapterMethodParamsForSearchADTTwins);
            }
        }
    };

    const CustomOption = (props) => {
        return props.data.__isNew__ ? (
            <components.Option {...props}></components.Option>
        ) : (
            <components.Option {...props}>
                {getMarkedHtmlBySearch(props.data.label, searchValue, true)}
            </components.Option>
        );
    };

    const Menu = (props: MenuProps) => {
        const twinSuggestionListWrapperRef = useRef<HTMLDivElement>(null);

        // register onscroll event to the original menuList component
        useEffect(() => {
            if (twinSuggestionListWrapperRef.current) {
                twinSuggestionListRef.current = twinSuggestionListWrapperRef.current.querySelector(
                    'div'
                );
                twinSuggestionListRef.current.onscroll = handleOnScroll;
            }
        }, [twinSuggestionListWrapperRef]);
        return (
            <Callout
                directionalHintFixed
                directionalHint={DirectionalHint.bottomCenter}
                gapSpace={-1}
                isBeakVisible={false}
                styles={classNames.subComponentStyles.callout}
                target={`#${selectId}`}
            >
                <div
                    ref={twinSuggestionListWrapperRef}
                    onScroll={handleOnScroll}
                >
                    <components.MenuList {...(props as any)} />
                </div>
            </Callout>
        );
    };

    // imperative handle to expose modifying the state
    useImperativeHandle(ref, () => ({
        setValue: (newValue: string) => {
            setSearchValue(newValue);
            setSelectedOption(createOption(newValue));
        }
    }));

    logDebugConsole(
        'debug',
        'Render {searchValue, selectedOption}',
        searchValue,
        selectedOption
    );
    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 4 }}>
                {!isLabelHidden && (
                    <Stack horizontal>
                        <Label
                            className="cb-label cb-required-icon"
                            id={'twin-search-dropdown-label'}
                        >
                            {labelIconName && (
                                <Icon
                                    styles={{ root: { paddingRight: 4 } }}
                                    iconName={labelIconName}
                                    aria-hidden="true"
                                />
                            )}
                            {label ?? t('twinId')}
                        </Label>
                        {labelTooltip && (
                            <TooltipCallout content={labelTooltip} />
                        )}
                    </Stack>
                )}

                <CreatableSelect
                    aria-labelledby="twin-search-dropdown-label"
                    className={classNames.dropdown}
                    options={
                        searchTwinAdapterData.isLoading ? [] : dropdownOptions
                    }
                    defaultValue={dropdownOptions[0] ?? undefined}
                    defaultInputValue={searchValue ?? ''}
                    id={selectId}
                    inputValue={searchValue}
                    value={selectedOption}
                    components={{
                        Option: CustomOption,
                        Menu: Menu
                    }}
                    onInputChange={(inputValue, actionMeta) => {
                        logDebugConsole(
                            'debug',
                            'onInputChange. {value, metadata}',
                            inputValue,
                            actionMeta
                        );
                        switch (actionMeta.action) {
                            case 'input-change':
                                setSearchValue(inputValue);
                                shouldAppendOptions.current = false;
                                twinSearchContinuationToken.current = null;
                                searchTwinAdapterData.cancelAdapter();
                                searchTwinAdapterData.callAdapter({
                                    searchProperty: searchPropertyName,
                                    searchTerm: inputValue,
                                    shouldSearchByModel: false,
                                    continuationToken:
                                        twinSearchContinuationToken.current
                                } as AdapterMethodParamsForSearchADTTwins);

                                if (!inputValue && actionMeta.prevInputValue) {
                                    setSelectedOption(null);
                                }
                                break;
                            case 'input-blur':
                                // revert the text value back to the previously selected value instead of keeping the typed value
                                if (resetInputOnBlur) {
                                    setSearchValue(selectedOption?.value ?? '');
                                } else {
                                    logDebugConsole(
                                        'debug',
                                        'lost focus, setting selection to current text:',
                                        searchValue
                                    );
                                    onChange(searchValue);
                                    setSelectedOption(
                                        searchValue
                                            ? createOption(searchValue)
                                            : null
                                    );
                                }
                                break;
                        }
                    }}
                    onChange={(option: { value: string; label: string }) => {
                        logDebugConsole('debug', 'onChange', option);
                        setSearchValue(option?.value ?? '');
                        setSelectedOption(option);
                        onChange(option?.value ?? undefined);
                    }}
                    onMenuOpen={() => {
                        // if no data or only the default entry
                        if (
                            dropdownOptions.length === 0 ||
                            dropdownOptions.length === 1
                        ) {
                            logDebugConsole(
                                'debug',
                                `Menu opened, fetching data for search term: ${searchValue}`
                            );
                            shouldAppendOptions.current = false;
                            twinSearchContinuationToken.current = null;
                            searchTwinAdapterData.callAdapter({
                                searchProperty: searchPropertyName,
                                searchTerm: searchValue,
                                shouldSearchByModel: false,
                                continuationToken: null
                            } as AdapterMethodParamsForSearchADTTwins);
                        }
                    }}
                    placeholder={
                        placeholderText ||
                        t('3dSceneBuilder.searchTwinIdPlaceholder')
                    }
                    noOptionsMessage={() =>
                        noOptionsText || t('3dSceneBuilder.noTwinsFound')
                    }
                    isLoading={searchTwinAdapterData.isLoading}
                    formatCreateLabel={(inputValue: string) =>
                        `${t(
                            '3dSceneBuilder.useNonExistingTwinId'
                        )} "${inputValue}"`
                    }
                    isSearchable
                    isClearable
                    styles={selectStyles}
                />
                {descriptionText && (
                    <Text
                        styles={classNames.subComponentStyles.description}
                        variant={'small'}
                    >
                        {descriptionText}
                    </Text>
                )}
            </Stack>
        </div>
    );
};

export default styled<
    ITwinPropertySearchDropdownProps & React.RefAttributes<PropertyValueHandle>,
    ITwinPropertySearchDropdownStyleProps,
    ITwinPropertySearchDropdownStyles
>(forwardRef(TwinPropertySearchDropdown), getStyles);
