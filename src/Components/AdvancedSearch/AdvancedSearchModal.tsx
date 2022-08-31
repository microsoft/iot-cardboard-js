import React, { useEffect, useRef } from 'react';
import {
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
} from './AdvancedSearch.types';
import { getStyles } from './AdvancedSearch.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Modal,
    Icon
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import QueryBuilder from './Internal/QueryBuilder/QueryBuilder';
import AdvancedSearchResultDetailsList from './Internal/AdvancedSearchResultDetailsList/AdvancedSearchResultDetailsList';
import {
    AdapterMethodParamsForAdvancedSearchADTwins,
    IADTTwin
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { useAdapter } from '../../Models/Hooks';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const AdvancedSearchModal: React.FC<IAdvancedSearchProps> = (props) => {
    const {
        adapter,
        allowedPropertyValueTypes,
        isOpen,
        onDismiss,
        styles,
        theme
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const { t } = useTranslation();
    const titleId = useId('advanced-search-modal-title');
    const filteredTwins = useRef<IADTTwin[]>([]);
    const additionalProperties = useRef(new Set<string>());
    const searchForTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForAdvancedSearchADTwins) =>
            adapter.advancedSearchADTTwins(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const executeQuery = (query: string) => {
        searchForTwinAdapterData.callAdapter({
            query: query,
            // TODO: Define onScroll method on list to change continuation token
            continuationToken: null
        });
    };

    useEffect(() => {
        const selectedTwins: IADTTwin[] = [];
        if (searchForTwinAdapterData.adapterResult?.result?.data) {
            searchForTwinAdapterData.adapterResult.result.data.value.map(
                (twinData: IADTTwin) => {
                    selectedTwins.push(twinData);
                }
            );
        }
        filteredTwins.current = selectedTwins;
    }, [searchForTwinAdapterData.adapterResult]);

    const updateColumns = (properties: Set<string>) => {
        additionalProperties.current = properties;
    };

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            titleAriaId={titleId}
            styles={classNames.subComponentStyles.modal}
            layerProps={{ eventBubblingEnabled: true }}
        >
            <BaseComponent theme={theme}>
                <div className={classNames.header}>
                    <div className={classNames.mainHeader}>
                        <Icon
                            iconName={'search'}
                            styles={classNames.subComponentStyles.icon}
                        />
                        <h3 id={'titleId'} className={classNames.headerText}>
                            {t('advancedSearch.modalTitle')}
                        </h3>
                    </div>
                    <p className={classNames.subtitle}>
                        {t('advancedSearch.modalSubtitle')}
                    </p>
                </div>
                <div className={classNames.content}>
                    <div className={classNames.queryContainer}>
                        <QueryBuilder
                            adapter={adapter}
                            allowedPropertyValueTypes={
                                allowedPropertyValueTypes
                            }
                            executeQuery={executeQuery}
                            updateColumns={updateColumns}
                            theme={theme}
                        />
                    </div>
                    <div className={classNames.resultsContainer}>
                        <AdvancedSearchResultDetailsList
                            twins={filteredTwins.current}
                            searchedProperties={Array.from(
                                additionalProperties.current
                            )}
                            adapter={adapter}
                            onTwinSelection={null}
                        />
                    </div>
                </div>
            </BaseComponent>
        </Modal>
    );
};

export default styled<
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>(AdvancedSearchModal, getStyles);
