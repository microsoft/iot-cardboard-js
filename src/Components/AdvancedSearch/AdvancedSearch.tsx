import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    IStackTokens
} from '@fluentui/react';
import QueryBuilder from './Internal/QueryBuilder/QueryBuilder';
import AdvancedSearchResultDetailsList from './Internal/AdvancedSearchResultDetailsList/AdvancedSearchResultDetailsList';
import {
    AdapterMethodParamsForSearchTwinsByQuery,
    IADTTwin
} from '../../Models/Constants';
import { useTranslation } from 'react-i18next';
import { useAdapter } from '../../Models/Hooks';
import CardboardModal from '../CardboardModal/CardboardModal';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const CONTENT_MAX_HEIGHT = 515;
const contentStackTokens: IStackTokens = {
    maxHeight: CONTENT_MAX_HEIGHT
};

const AdvancedSearch: React.FC<IAdvancedSearchProps> = (props) => {
    const {
        adapter,
        allowedPropertyValueTypes,
        isOpen,
        onDismiss,
        onTwinIdSelect,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const { t } = useTranslation();
    const filteredTwins = useRef<IADTTwin[]>([]);
    const additionalProperties = useRef(new Set<string>());
    const searchForTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchTwinsByQuery) =>
            adapter.searchTwinsByQuery(params),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });
    const [selectedTwinId, updateSelectedTwinId] = useState<string>('');

    const executeQuery = (query: string) => {
        searchForTwinAdapterData.callAdapter({
            query
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

    const onConfirmSelection = useCallback(() => {
        onTwinIdSelect(selectedTwinId);
        onDismiss();
    }, [selectedTwinId]);

    return (
        <>
            <CardboardModal
                isOpen={isOpen}
                contentStackProps={{ tokens: contentStackTokens }}
                onDismiss={onDismiss}
                title={t('advancedSearch.modalTitle')}
                titleIconName={'Search'}
                subTitle={t('advancedSearch.modalSubtitle')}
                modalProps={{ layerProps: { eventBubblingEnabled: true } }}
                primaryButtonProps={{
                    text: t('select'),
                    disabled: !selectedTwinId.length,
                    onClick: onConfirmSelection
                }}
                styles={classNames.subComponentStyles.modal}
            >
                <QueryBuilder
                    adapter={adapter}
                    allowedPropertyValueTypes={allowedPropertyValueTypes}
                    executeQuery={executeQuery}
                    updateColumns={updateColumns}
                />
                <AdvancedSearchResultDetailsList
                    adapter={adapter}
                    isLoading={searchForTwinAdapterData.isLoading}
                    containsError={searchForTwinAdapterData.adapterResult.hasError()}
                    onTwinIdSelect={updateSelectedTwinId}
                    searchedProperties={Array.from(
                        additionalProperties.current
                    )}
                    twins={filteredTwins.current}
                    styles={
                        classNames.subComponentStyles.advancedSearchDetailsList
                    }
                />
            </CardboardModal>
        </>
    );
};

export default styled<
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>(AdvancedSearch, getStyles);
