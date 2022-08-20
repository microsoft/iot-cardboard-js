import React, { useRef } from 'react';
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
import { IADTTwin } from '../../Models/Constants';
import twinData from '../../Adapters/__mockData__/MockAdapterData/DemoEnvsTwinData.json';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const filteredTwins: IADTTwin[] = twinData;

const cols = ['FailedPickupsLastHr', 'HydraulicPressure'];
const AdvancedSearchModal: React.FC<IAdvancedSearchProps> = (props) => {
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
    const titleId = useId('advanced-search-modal-title');
    const additionalProperties = useRef(new Set<string>());
    const executeQuery = (query: string) => {
        alert(query);
    };
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
            <div className={classNames.header}>
                <div className={classNames.mainHeader}>
                    <Icon
                        iconName={'search'}
                        styles={classNames.subComponentStyles.icon}
                    />
                    {/* TODO: Add translations for this */}
                    <h3 id={'titleId'} className={classNames.headerText}>
                        Advanced property search
                    </h3>
                </div>
                <p className={classNames.subtitle}>
                    Link the right property by narrowing down your search
                </p>
            </div>
            <div className={classNames.content}>
                <div className={classNames.queryContainer}>
                    <QueryBuilder
                        adapter={adapter}
                        allowedPropertyValueTypes={allowedPropertyValueTypes}
                        executeQuery={executeQuery}
                        updateColumns={updateColumns}
                    />
                </div>
                <div className={classNames.resultsContainer}>
                    <AdvancedSearchResultDetailsList
                        twins={filteredTwins}
                        searchedProperties={cols}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default styled<
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>(AdvancedSearchModal, getStyles);
