import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SearchBox,
    PrimaryButton,
    Toggle,
    MessageBar,
    MessageBarType
} from '@fluentui/react';
import './ModelSearch.scss';
import { useAdapter } from '../../Models/Hooks';
import GithubAdapter from '../../Adapters/GithubAdapter';

const ModelSearch = () => {
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState('');
    const [fileNameOnly, setFileNameOnly] = useState(true);
    const adapter = useRef(new GithubAdapter());

    const searchDataState = useAdapter({
        adapterMethod: (params: { queryString: string }) =>
            adapter.current.searchStringInRepo(params?.queryString),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const onSearch = async () => {
        if (searchString.length > 0) {
            let queryString;
            if (fileNameOnly) {
                queryString = encodeURIComponent(
                    `filename:${searchString} path:dtmi extension:json repo:Azure/iot-plugandplay-models`
                );
            } else {
                queryString = encodeURIComponent(
                    `${searchString} in:file,path path:dtmi extension:json repo:Azure/iot-plugandplay-models`
                );
            }

            searchDataState.callAdapter({ queryString });
        }
    };

    useEffect(() => {
        const data = searchDataState.adapterResult.result?.data;
        console.log(data);
    }, [searchDataState.adapterResult]);

    useEffect(() => {
        if (searchString.length > 0) {
            onSearch();
        }
    }, [fileNameOnly]);

    return (
        <div className="cb-modelsearch-container">
            <div className="cb-ms-searchbar">
                <SearchBox
                    className="cb-ms-searchbox"
                    placeholder={t('modelSearch.placeholder')}
                    value={searchString}
                    onChange={(
                        _event?: React.ChangeEvent<HTMLInputElement>,
                        newValue?: string
                    ) => setSearchString(newValue)}
                    onSearch={onSearch}
                />
                <PrimaryButton
                    text={t('search')}
                    onClick={onSearch}
                    disabled={searchString.length === 0}
                />
            </div>
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
            <div className="cb-ms-model-list">{}</div>
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
