import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Label, Stack, Text } from '@fluentui/react';
import { components, MenuListProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useAdapter from '../../Models/Hooks/useAdapter';
import { AdapterMethodParamsForSearchADTTwins } from '../../Models/Constants/Types';
import { getMarkedHtmlBySearch } from '../../Models/Services/Utils';
import './TwinSearchDropdown.scss';
import { ADTAdapter, MockAdapter } from '../../Adapters';
import TooltipCallout from '../TooltipCallout/TooltipCallout';
import { ITooltipCalloutContent } from '../TooltipCallout/TooltipCallout.types';
import { IADTTwin } from '../../Models/Constants';
interface IADTTwinSearchProps {
    adapter: ADTAdapter | MockAdapter;
    searchPropertyName: string;
    label?: string;
    labelIconName?: string;
    labelTooltip?: ITooltipCalloutContent;
    isLabelHidden?: boolean;
    descriptionText?: string;
    placeholderText?: string;
    selectedValue?: string;
    onChange?: (selectedValue: string) => void;
    styles?: CSSProperties;
}

const SuggestionListScrollThresholdFactor = 40;
const TwinSearchDropdown: React.FC<IADTTwinSearchProps> = ({
    adapter,
    label,
    labelIconName,
    labelTooltip,
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

    const CustomMenuList = (props: MenuListProps) => {
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
            <div ref={twinSuggestionListWrapperRef} onScroll={handleOnScroll}>
                <components.MenuList {...props}>
                    {props.children}
                </components.MenuList>
            </div>
        );
    };

    return (
        <div style={styles}>
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
                        MenuList: CustomMenuList
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

export default TwinSearchDropdown;
