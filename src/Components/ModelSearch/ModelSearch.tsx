import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    modelActionType
} from '../../Models/Constants';
import JsonPreview from '../JsonPreview/JsonPreview';
import AutoCompleteSearchBox from '../Searchbox/AutoCompleteSearchBox/AutoCompleteSearchBox';

type ModelSearchProps = {
    onStandardModelSelection?: (modelJsonData: any) => any;
    adapter: IStandardModelSearchAdapter;
};

const ModelSearch = ({
    onStandardModelSelection = () => null,
    adapter
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
        if (dtdl?.displayName && typeof dtdl.displayName === 'string') {
            return dtdl.displayName;
        } else if (
            dtdl?.displayName &&
            typeof dtdl.displayName === 'object' &&
            'en' in dtdl.displayName
        ) {
            return dtdl.displayName.en;
        } else if (dtdl?.['@id']) {
            return dtdl['@id'];
        } else {
            return null;
        }
    };

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
                searchIndex={
                    modelIndexState.adapterResult.getData()
                        ?.modelSearchStringIndex
                }
                setValue={(value) => setSearchString(value)}
                searchDisabled={modelIndexState.isLoading}
            />
            <div className="cb-ms-info">
                <p>
                    {t('modelSearch.description')}
                    <a
                        className="cb-ms-info-description-link"
                        href="https://github.com/Azure/iot-plugandplay-models"
                        target="_blank"
                    >
                        Azure/iot-plugandplay-models
                    </a>
                    {t('modelSearch.repository')}.
                </p>
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
            <ModelSearchList
                items={mergedSearchResults}
                adapterState={modelDataState}
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
    if (rateLimitResetTime === undefined) {
        return null;
    }
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
