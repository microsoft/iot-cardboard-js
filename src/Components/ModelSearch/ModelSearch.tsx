import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
    MessageBar,
    MessageBarType,
    DefaultButton,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import './ModelSearch.scss';
import { useAdapter } from '../../Models/Hooks';
import ModelSearchList from './ModelSearchList/ModelSearchList';
import {
    IStandardModelSearchAdapter,
    IStandardModelSearchItem,
    modelActionType
} from '../../Models/Constants';
import JsonPreview from '../JsonPreview/JsonPreview';
import AutoCompleteSearchBox from '../Searchbox/AutoCompleteSearchBox/AutoCompleteSearchBox';
import {
    CdnModelSearchAdapter,
    GithubModelSearchAdapter
} from '../../Adapters';
import ModelIndexSearchResultsBuilder from '../../Models/Classes/ModelIndexSearchResultsBuilder';

type ModelSearchProps = {
    onStandardModelSelection?: (modelJsonData: any) => any;
    adapter: IStandardModelSearchAdapter;
    primaryActionText?: string;
};

const ModelSearch = ({
    onStandardModelSelection = () => null,
    adapter,
    primaryActionText
}: ModelSearchProps) => {
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState('');
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const [mergedSearchResults, setMergedSearchResults] = useState(null);

    const modelIndexState = useAdapter({
        adapterMethod: () => adapter.getModelSearchIndex(),
        refetchDependencies: [],
        isAdapterCalledOnMount: true
    });

    const searchDataState = useAdapter({
        adapterMethod: (params: { queryString: string; pageIdx?: number }) =>
            adapter.searchString({
                queryString: params.queryString,
                pageIdx: params.pageIdx,
                modelIndex: modelIndexState.adapterResult.getData()
                    ?.modelSearchIndexObj
            }),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const modelDataState = useAdapter({
        adapterMethod: (params: {
            dtmi: string;
            actionType: modelActionType;
        }) => adapter.fetchModelJsonFromCDN(params.dtmi, params.actionType),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const onSearch = async (newVal?: string) => {
        clearSearchResults();
        const targetString = newVal ? newVal : searchString;
        if (targetString.length > 0) {
            searchDataState.callAdapter({ queryString: targetString });
        }
    };

    // When model json data is updated, trigger select / preview actions
    useEffect(() => {
        const modelData = modelDataState.adapterResult.getData();
        if (modelData) {
            if (modelData.actionType === modelActionType.select) {
                onStandardModelSelection(modelData.json);
            } else if (modelData.actionType === modelActionType.preview) {
                setIsModelPreviewOpen(true);
            }
        }
    }, [modelDataState.adapterResult]);

    // Merge paginated search results with current search results
    useEffect(() => {
        const newData = searchDataState.adapterResult.getData()?.data;
        if (newData) {
            setMergedSearchResults((oldData) =>
                oldData ? [...oldData, ...newData] : newData
            );
        }
    }, [searchDataState.adapterResult.result]);

    const clearSearchResults = () => {
        searchDataState.cancelAdapter();
        setMergedSearchResults(null);
    };

    const getJsonPreviewTitle = () => {
        const dtdl = modelDataState.adapterResult.getData()?.json?.[0];
        const getStringOrNull = (valToTest) =>
            typeof valToTest === 'string' ? valToTest : null;
        return (
            getStringOrNull(dtdl?.displayName?.en) ||
            getStringOrNull(dtdl?.displayName) ||
            getStringOrNull(dtdl?.['@id']) ||
            null
        );
    };

    const getDescription = useCallback(() => {
        if (adapter instanceof CdnModelSearchAdapter) {
            return (
                <Trans
                    t={t}
                    i18nKey="modelSearch.cdnModelSearchdescription"
                    components={{
                        CndLink: <a href={adapter.CdnUrl} target="_blank"></a>
                    }}
                />
            );
        } else if (adapter instanceof GithubModelSearchAdapter) {
            return (
                <Trans
                    t={t}
                    i18nKey="modelSearch.githubModelSearchdescription"
                    values={{ repo: adapter.githubRepo }}
                    components={{
                        GithubRepo: (
                            <a
                                href={`https://github.com/${adapter.githubRepo}`}
                                target="_blank"
                            ></a>
                        )
                    }}
                />
            );
        }
    }, [adapter, t]);

    return (
        <div className="cb-modelsearch-container">
            <AutoCompleteSearchBox
                onChange={(
                    _event?: React.ChangeEvent<HTMLInputElement>,
                    newValue?: string
                ) => {
                    if (newValue === '') {
                        clearSearchResults();
                    }
                    setSearchString(newValue);
                }}
                value={searchString}
                onClear={() => clearSearchResults()}
                onSearch={(newVal) => onSearch(newVal)}
                findSuggestions={(input: string) => {
                    const index = modelIndexState.adapterResult.getData()
                        ?.modelSearchIndexObj;
                    if (index) {
                        const builder = new ModelIndexSearchResultsBuilder(
                            index
                        );

                        Object.keys(index).forEach((key) => {
                            builder.addItemToResults(key, input);
                        });
                        return builder.results;
                    }
                }}
                onRenderSuggestionCell={(item: IStandardModelSearchItem) => {
                    return (
                        <div className="cb-modelsearch-suggestion-item">
                            <div className="cb-modelsearch-suggestion-item-id">
                                {item.dtmi}
                            </div>
                            <div className="cb-modelsearch-suggestion-item-name">
                                {item.displayName}
                            </div>
                            <div className="cb-modelsearch-suggestion-item-description">
                                {item.description}
                            </div>
                        </div>
                    );
                }}
                onSelectSuggestedItem={(item: IStandardModelSearchItem) => {
                    onSearch(item.dtmi);
                    setSearchString(item.dtmi);
                }}
                searchDisabled={modelIndexState.isLoading}
            />
            <div className="cb-ms-info">
                <p>{getDescription()}</p>
            </div>
            {searchDataState.adapterResult.getData()?.metadata
                ?.rateLimitRemaining === 0 && (
                <RateLimitExceededWarning
                    rateLimitResetTime={
                        searchDataState.adapterResult.getData().metadata
                            .rateLimitReset
                    }
                />
            )}
            <div className="cb-ms-results">
                <ModelSearchList
                    items={mergedSearchResults}
                    adapterState={modelDataState}
                    primaryActionText={primaryActionText}
                />
                {searchDataState.adapterResult.getData()?.metadata
                    ?.hasMoreItems && (
                    <DefaultButton
                        className="cb-ms-show-more"
                        text={t('showMore')}
                        onClick={() =>
                            searchDataState.callAdapter({
                                queryString: searchString,
                                pageIdx: searchDataState.adapterResult.getData()
                                    .metadata?.pageIdx
                            })
                        }
                        disabled={searchDataState.isLoading}
                    />
                )}
            </div>

            {isModelPreviewOpen && (
                <JsonPreview
                    json={modelDataState.adapterResult.getData()?.json}
                    isOpen={isModelPreviewOpen}
                    onDismiss={() => setIsModelPreviewOpen(false)}
                    modalTitle={getJsonPreviewTitle()}
                />
            )}
            {(modelIndexState.isLoading || searchDataState.isLoading) && (
                <Spinner size={SpinnerSize.large} />
            )}
        </div>
    );
};

const RateLimitExceededWarning = ({ rateLimitResetTime }) => {
    const { t } = useTranslation();
    const [
        isRateLimitExceededWarningVisible,
        setIsRateLimitExceededWarningVisible
    ] = useState(true);
    const [secondsUntilReset, setSecondsUntilReset] = useState(
        new Date(rateLimitResetTime * 1000 - new Date().getTime()).getTime() /
            1000
    );
    const countdownIntervalRef = useRef(null);

    useEffect(() => {
        countdownIntervalRef.current = setInterval(() => {
            setSecondsUntilReset((val) => val - 1);
        }, 1000);
        return () => {
            clearInterval(countdownIntervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (secondsUntilReset <= 0) {
            clearInterval(countdownIntervalRef.current);
            setIsRateLimitExceededWarningVisible(false);
        }
    }, [secondsUntilReset]);

    if (rateLimitResetTime === undefined) {
        return null;
    }

    if (!isRateLimitExceededWarningVisible) {
        return null;
    }

    return (
        <div>
            <MessageBar
                onDismiss={null}
                messageBarType={MessageBarType.warning}
            >
                <b>{t('modelSearch.rateLimitExceededTitle')}</b>.{' '}
                {t('modelSearch.rateLimitExceededDescription', {
                    numSeconds: Math.ceil(secondsUntilReset)
                })}
                .
            </MessageBar>
        </div>
    );
};

export default ModelSearch;
