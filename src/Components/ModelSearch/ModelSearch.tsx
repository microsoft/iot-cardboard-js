import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle, MessageBar, MessageBarType, Modal } from '@fluentui/react';
import './ModelSearch.scss';
import { useAdapter } from '../../Models/Hooks';
import StandardModelSearchAdapter from '../../Adapters/StandardModelSearchAdapter';
import ModelSearchList from './ModelSearchList/ModelSearchList';
import { modelActionType, ModelSearchRepository } from '../../Models/Constants';
import JsonPreview from '../JsonPreview/JsonPreview';
import AutoCompleteSearchBox from '../Searchbox/AutoCompleteSearchBox/AutoCompleteSearchBox';

type ModelSearchProps = {
    onStandardModelSelection?: (modelJsonData: any) => any;
};

const ModelSearch = ({
    onStandardModelSelection = () => null
}: ModelSearchProps) => {
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState('');
    const [fileNameOnly, setFileNameOnly] = useState(false);
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const adapter = useRef(new StandardModelSearchAdapter());

    const searchDataState = useAdapter({
        adapterMethod: (params: { queryString: string }) =>
            adapter.current.searchStringInRepo(params?.queryString),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const modelDataState = useAdapter({
        adapterMethod: (params: {
            modelPath: string;
            actionType: modelActionType;
        }) =>
            adapter.current.fetchModelJsonFromCDN(
                params.modelPath,
                params.actionType
            ),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const modelIndexState = useAdapter({
        adapterMethod: () => adapter.current.fetchModelIndexFromCDN(),
        refetchDependencies: [],
        isAdapterCalledOnMount: true
    });

    const onSearch = async (newVal?: string) => {
        const targetString = newVal ? newVal : searchString;
        if (targetString.length > 0) {
            let queryString;
            if (fileNameOnly) {
                queryString = encodeURIComponent(
                    `filename:${targetString} path:dtmi extension:json repo:${ModelSearchRepository}`
                );
            } else {
                queryString = encodeURIComponent(
                    `${targetString} in:file,path path:dtmi extension:json repo:${ModelSearchRepository}`
                );
            }

            searchDataState.callAdapter({ queryString });
        }
    };

    useEffect(() => {
        if (searchString.length > 0) {
            onSearch();
        }
    }, [fileNameOnly]);

    useEffect(() => {
        const modelData = modelDataState.adapterResult.result?.data;
        if (modelData) {
            if (modelData.actionType === modelActionType.select) {
                onStandardModelSelection(modelData.json);
            } else if (modelData.actionType === modelActionType.preview) {
                setIsModelPreviewOpen(true);
            }
        }
    }, [modelDataState.adapterResult]);

    return (
        <div className="cb-modelsearch-container">
            <AutoCompleteSearchBox
                onChange={(
                    _event?: React.ChangeEvent<HTMLInputElement>,
                    newValue?: string
                ) => {
                    if (newValue === '') {
                        searchDataState.cancelAdapter();
                    }
                    setSearchString(newValue);
                }}
                value={searchString}
                onClear={() => searchDataState.cancelAdapter()}
                onSearch={(newVal) => onSearch(newVal)}
                searchIndex={modelIndexState.adapterResult.result?.data}
                setValue={(value) => setSearchString(value)}
            />
            <div className="cb-ms-info-togglebar">
                <div className="cb-ms-info-togglebar-description">
                    <p>
                        {t('modelSearch.description')}
                        <a
                            className="cb-ms-info-togglebar-description-link"
                            href="https://github.com/Azure/iot-plugandplay-models"
                            target="_blank"
                        >
                            Azure/iot-plugandplay-models
                        </a>
                        {t('modelSearch.repository')}.
                    </p>
                </div>
                <Toggle
                    className="cb-ms-info-togglebar-toggle"
                    label={t('modelSearch.fileNameOnly')}
                    checked={fileNameOnly}
                    onText={t('on')}
                    offText={t('off')}
                    onChange={(
                        _ev: React.MouseEvent<HTMLElement>,
                        checked?: boolean
                    ) => {
                        setFileNameOnly(checked);
                    }}
                />
            </div>
            {searchDataState.adapterResult.result?.data?.rateLimitRemaining ===
                0 && (
                <RateLimitExceededWarning
                    rateLimitResetTime={
                        searchDataState.adapterResult.result?.data
                            .rateLimitReset
                    }
                />
            )}
            <ModelSearchList
                items={searchDataState.adapterResult.result?.data?.items}
                adapterState={modelDataState}
            />
            {isModelPreviewOpen && (
                <Modal
                    isOpen={isModelPreviewOpen}
                    onDismiss={() => setIsModelPreviewOpen(false)}
                    isBlocking={false}
                    scrollableContentClassName="cb-modelsearch-json-preview-scroll"
                >
                    <JsonPreview
                        json={modelDataState.adapterResult.result?.data?.json}
                    />
                </Modal>
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
