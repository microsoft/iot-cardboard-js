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
    Icon,
    Stack,
    IStackTokens
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import QueryBuilder from './Internal/QueryBuilder/QueryBuilder';
import AdvancedSearchResultDetailsList from './Internal/AdvancedSearchResultDetailsList/AdvancedSearchResultDetailsList';
import {
    AdapterMethodParamsForSearchTwinsByQuery,
    IADTTwin
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import { useAdapter } from '../../Models/Hooks';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const stackTokens: IStackTokens = {
    childrenGap: 20,
    maxHeight: 550
};

const AdvancedSearch: React.FC<IAdvancedSearchProps> = (props) => {
    const {
        adapter,
        allowedPropertyValueTypes,
        isOpen,
        onDismiss,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const { t } = useTranslation();
    const titleId = useId('advanced-search-modal-title');
    const filteredTwins = useRef<IADTTwin[]>([]);
    const additionalProperties = useRef(new Set<string>());
    const searchForTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchTwinsByQuery) =>
            adapter.searchTwinsByQuery(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const executeQuery = (query: string) => {
        searchForTwinAdapterData.callAdapter({
            query: query
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
            <div className={classNames.headerContainer}>
                <div className={classNames.titleContainer}>
                    <Icon
                        iconName={'search'}
                        styles={classNames.subComponentStyles.icon}
                    />
                    <h3 id={titleId} className={classNames.title}>
                        {t('advancedSearch.modalTitle')}
                    </h3>
                </div>
                <p className={classNames.subtitle}>
                    {t('advancedSearch.modalSubtitle')}
                </p>
            </div>
            <div className={classNames.content}>
                <Stack tokens={stackTokens}>
                    <QueryBuilder
                        adapter={adapter}
                        allowedPropertyValueTypes={allowedPropertyValueTypes}
                        executeQuery={executeQuery}
                        updateColumns={updateColumns}
                    />
                    <AdvancedSearchResultDetailsList
                        adapter={adapter}
                        isLoading={searchForTwinAdapterData.isLoading}
                        onTwinSelection={null}
                        searchedProperties={Array.from(
                            additionalProperties.current
                        )}
                        twins={filteredTwins.current}
                        styles={{
                            root: {
                                maxHeight: 380,
                                overflow: 'auto'
                            }
                        }}
                    />
                </Stack>
            </div>
        </Modal>
    );
};

export default styled<
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>(AdvancedSearch, getStyles);
