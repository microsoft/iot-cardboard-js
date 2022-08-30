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
import twinData from '../../Adapters/__mockData__/MockAdapterData/MockTwinData.json';
import { MockAdapter } from '../../Adapters';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const filteredTwins: IADTTwin[] = twinData;

const cols = ['InFlow', 'OutFlow', 'Temperature'];
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
    const additionalProperties = useRef(new Set<string>());
    // TODO: Make this actually call query
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
                            twins={filteredTwins}
                            searchedProperties={cols}
                            adapter={new MockAdapter()}
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
