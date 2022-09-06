import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Callout,
    classNamesFunction,
    Icon,
    Label,
    Stack,
    styled,
    Text,
    useTheme
} from '@fluentui/react';
import { components, MenuProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useAdapter from '../../Models/Hooks/useAdapter';
import { AdapterMethodParamsForSearchADTTwins } from '../../Models/Constants/Types';
import { getMarkedHtmlBySearch } from '../../Models/Services/Utils';
import './TwinSearchDropdown.scss';
import TooltipCallout from '../TooltipCallout/TooltipCallout';
import { IADTTwin } from '../../Models/Constants';
import { getReactSelectStyles } from '../Shared/ReactSelect.styles';
import { getStyles } from './TwinSearchDropdown.styles';
import {
    ITwinSearchDropdownProps,
    ITwinSearchDropdownStyleProps,
    ITwinSearchDropdownStyles
} from './TwinSearchDropdown.types';
const getClassNames = classNamesFunction<
    ITwinSearchDropdownStyleProps,
    ITwinSearchDropdownStyles
>();

const SuggestionListScrollThresholdFactor = 40;
const TwinSearchDropdown: React.FC<ITwinSearchDropdownProps> = ({
    adapter,
    label,
    labelIconName,
    labelTooltip,
    inputStyles,
    isLabelHidden = false,
    descriptionText,
    placeholderText,
    selectedValue,
    searchPropertyName,
    onChange,
    styles
}) => {
    const { t } = useTranslation();
    const [twinIdSearchTerm, setTwinIdSearchTerm] = useState(
        selectedValue ?? ''
    );
    const [twinSuggestions, setTwinSuggestions] = useState(
        selectedValue
            ? [
                  {
                      value: selectedValue,
                      label: selectedValue
                  }
              ]
            : []
    );

    const [selectedOption, setSelectedOption] = useState(
        selectedValue
            ? {
                  value: selectedValue,
                  label: selectedValue
              }
            : null
    );

    const theme = useTheme();
    const dropdownWidth = document.getElementById('myid')?.offsetWidth || 200;
    // Classname after state to track row #
    const classNames = getClassNames(styles, {
        theme: theme,
        menuWidth: dropdownWidth
    });
    const selectStyles = useMemo(
        () => inputStyles || getReactSelectStyles(theme),
        [theme, inputStyles]
    );

    const shouldAppendTwinSuggestions = useRef(false);
    const twinSearchContinuationToken = useRef(null);
    const lastScrollTopRef = useRef(0);
    const twinSuggestionListRef = useRef<HTMLDivElement>();

    const searchTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchADTTwins) =>
            adapter.searchADTTwins(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    useEffect(() => {
        if (searchTwinAdapterData.adapterResult?.result?.data) {
            if (shouldAppendTwinSuggestions.current) {
                setTwinSuggestions(
                    twinSuggestions.concat(
                        searchTwinAdapterData.adapterResult.result.data.value.map(
                            (t: IADTTwin) => ({
                                value: t[searchPropertyName],
                                label: t[searchPropertyName]
                            })
                        )
                    )
                );
            } else {
                setTwinSuggestions(
                    searchTwinAdapterData.adapterResult.result.data.value.map(
                        (t: IADTTwin) => ({
                            value: t[searchPropertyName],
                            label: t[searchPropertyName]
                        })
                    )
                );
            }

            twinSearchContinuationToken.current =
                searchTwinAdapterData.adapterResult.result.data.continuationToken;
        }
    }, [searchTwinAdapterData.adapterResult]);

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
                shouldAppendTwinSuggestions.current = true;
                searchTwinAdapterData.callAdapter({
                    searchProperty: searchPropertyName,
                    searchTerm: twinIdSearchTerm,
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
                {getMarkedHtmlBySearch(
                    props.data.label,
                    twinIdSearchTerm,
                    true
                )}
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
                target={`#myid`}
                styles={classNames.subComponentStyles.callout}
                isBeakVisible={false}
            >
                <div
                    ref={twinSuggestionListWrapperRef}
                    onScroll={handleOnScroll}
                >
                    <components.MenuList
                        {...(props as any)}
                        styles={selectStyles.menuList}
                    >
                        {props.children}
                    </components.MenuList>
                </div>
            </Callout>
        );
    };

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
                    id={'myid'}
                    aria-labelledby="twin-search-dropdown-label"
                    classNamePrefix="cb-search-autocomplete"
                    className="cb-search-autocomplete-container"
                    options={
                        searchTwinAdapterData.isLoading ? [] : twinSuggestions
                    }
                    defaultValue={twinSuggestions[0] ?? undefined}
                    defaultInputValue={selectedValue ?? ''}
                    value={selectedOption}
                    inputValue={twinIdSearchTerm}
                    components={{
                        Option: CustomOption,
                        Menu: Menu
                    }}
                    onInputChange={(inputValue, actionMeta) => {
                        if (actionMeta.action === 'input-change') {
                            setTwinIdSearchTerm(inputValue);
                            shouldAppendTwinSuggestions.current = false;
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
                        } else if (actionMeta.action === 'menu-close') {
                            setTwinSuggestions(
                                selectedOption ? [selectedOption] : []
                            );
                            setTwinIdSearchTerm(selectedOption?.value ?? '');
                        }
                    }}
                    onChange={(option: any) => {
                        if (!option) {
                            setTwinSuggestions([]);
                        } else {
                            setTwinSuggestions([option]);
                        }
                        setTwinIdSearchTerm(option?.value ?? '');
                        setSelectedOption(option);
                        onChange(option?.value ?? undefined);
                    }}
                    onMenuOpen={() => {
                        if (twinSuggestions.length === 0) {
                            shouldAppendTwinSuggestions.current = false;
                            twinSearchContinuationToken.current = null;
                            searchTwinAdapterData.callAdapter({
                                searchProperty: searchPropertyName,
                                searchTerm: twinIdSearchTerm,
                                shouldSearchByModel: false,
                                continuationToken: null
                            } as AdapterMethodParamsForSearchADTTwins);
                        }
                    }}
                    menuIsOpen={true}
                    placeholder={
                        placeholderText || t('3dSceneBuilder.searchTwinId')
                    }
                    noOptionsMessage={() => t('3dSceneBuilder.noTwinsFound')}
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
                        className="cb-search-autocomplete-desc"
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
    ITwinSearchDropdownProps,
    ITwinSearchDropdownStyleProps,
    ITwinSearchDropdownStyles
>(TwinSearchDropdown, getStyles);
