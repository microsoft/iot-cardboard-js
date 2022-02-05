import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Text } from '@fluentui/react';
import { IADT3DSceneBuilderTwinSearchProps } from '../../ADT3DSceneBuilder.types';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { AdapterMethodParamsForSearchADTTwins } from '../../../../../Models/Constants/Types';
import Select, { components, MenuListProps } from 'react-select';
import { Utils } from '../../../../../Models/Services';

const SuggestionListScrollThresholdFactor = 40;
const TwinSearchDropdown: React.FC<IADT3DSceneBuilderTwinSearchProps> = ({
    selectedTwinId,
    onTwinIdSelect
}) => {
    const { t } = useTranslation();
    const { adapter } = useContext(SceneBuilderContext);
    const [twinIdSearchTerm, setTwinIdSearchTerm] = useState(
        selectedTwinId ?? ''
    );
    const [twinSuggestions, setTwinSuggestions] = useState(
        selectedTwinId
            ? [
                  {
                      value: selectedTwinId,
                      label: selectedTwinId
                  }
              ]
            : []
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
                            (t) => ({
                                value: t.$dtId,
                                label: t.$dtId
                            })
                        )
                    )
                );
            } else {
                setTwinSuggestions(
                    searchTwinAdapterData.adapterResult.result.data.value.map(
                        (t) => ({
                            value: t.$dtId,
                            label: t.$dtId
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
                    searchTerm: twinIdSearchTerm,
                    shouldSearchByModel: false,
                    continuationToken: twinSearchContinuationToken.current
                } as AdapterMethodParamsForSearchADTTwins);
            }
        }
    };

    const CustomOption = (props) => {
        return (
            <components.Option {...props}>
                {Utils.getMarkedHtmlBySearch(
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
        <div>
            <Label className="cb-required-icon">
                {t('3dSceneBuilder.linkedTwin')}
            </Label>
            <Select
                classNamePrefix="cb-search-autocomplete"
                className="cb-search-autocomplete-container"
                options={searchTwinAdapterData.isLoading ? [] : twinSuggestions}
                defaultValue={twinSuggestions[0] ?? undefined}
                components={{
                    Option: CustomOption,
                    MenuList: CustomMenuList
                }}
                onInputChange={(inputValue, actionMeta) => {
                    setTwinIdSearchTerm(inputValue);
                    if (actionMeta.action === 'input-change') {
                        shouldAppendTwinSuggestions.current = false;
                        twinSearchContinuationToken.current = null;
                        searchTwinAdapterData.cancelAdapter();
                        if (inputValue) {
                            searchTwinAdapterData.callAdapter({
                                searchTerm: inputValue,
                                shouldSearchByModel: false,
                                continuationToken:
                                    twinSearchContinuationToken.current
                            } as AdapterMethodParamsForSearchADTTwins);
                        } else {
                            setTwinSuggestions([]);
                        }
                    }
                }}
                onChange={(option: any) => {
                    if (!option) {
                        setTwinSuggestions([]);
                    }
                    onTwinIdSelect(option?.value ?? undefined);
                }}
                placeholder={t('3dSceneBuilder.searchTwinId')}
                isLoading={searchTwinAdapterData.isLoading}
                isSearchable
                isClearable
            />
            <Text className="cb-search-autocomplete-desc" variant={'xSmall'}>
                {t('3dSceneBuilder.linkedTwinInputInfo')}
            </Text>
        </div>
    );
};

export default TwinSearchDropdown;
