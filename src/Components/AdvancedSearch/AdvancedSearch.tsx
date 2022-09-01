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
    Icon,
    Stack,
    IStackTokens
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
const AdvancedSearch: React.FC<IAdvancedSearchProps> = (props) => {
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
    const stackTokens: IStackTokens = {
        childrenGap: '20px',
        maxHeight: 550
    };

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            titleAriaId={titleId}
            styles={classNames.subComponentStyles.modal}
            layerProps={{ eventBubblingEnabled: true }}
        >
            <BaseComponent theme={theme} disableDefaultStyles={true}>
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
                            allowedPropertyValueTypes={
                                allowedPropertyValueTypes
                            }
                            executeQuery={executeQuery}
                            updateColumns={updateColumns}
                            theme={theme}
                        />
                        <AdvancedSearchResultDetailsList
                            twins={filteredTwins}
                            searchedProperties={cols}
                            adapter={new MockAdapter()}
                            onTwinSelection={null}
                            styles={{
                                root: {
                                    maxHeight: 380,
                                    overflow: 'auto'
                                }
                            }}
                        />
                    </Stack>
                </div>
            </BaseComponent>
        </Modal>
    );
};

export default styled<
    IAdvancedSearchProps,
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>(AdvancedSearch, getStyles);
