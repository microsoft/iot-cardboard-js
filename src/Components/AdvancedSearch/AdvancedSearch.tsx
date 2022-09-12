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
    Modal,
    Icon,
    Stack,
    IStackTokens,
    PrimaryButton,
    DefaultButton
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
    maxHeight: 550
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
    const titleId = useId('advanced-search-modal-title');
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
                        containsError={searchForTwinAdapterData.adapterResult.hasError()}
                        onTwinIdSelect={updateSelectedTwinId}
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
                    <div>
                        <Stack
                            tokens={{ childrenGap: 8 }}
                            horizontal={true}
                            horizontalAlign={'end'}
                        >
                            <PrimaryButton
                                text={t('select')}
                                disabled={!selectedTwinId.length}
                                onClick={onConfirmSelection}
                            />
                            <DefaultButton
                                text={t('cancel')}
                                onClick={onDismiss}
                            />
                        </Stack>
                    </div>
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
