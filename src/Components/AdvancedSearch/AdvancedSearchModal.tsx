import React from 'react';
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
import QueryBuilder from './Internal/QueryBuilder';
import AdvancedSearchResults from './Internal/AdvancedSearchResults';

const getClassNames = classNamesFunction<
    IAdvancedSearchStyleProps,
    IAdvancedSearchStyles
>();

const AdvancedSearchModal: React.FC<IAdvancedSearchProps> = (props) => {
    const { isOpen, onDismiss, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const titleId = useId('advanced-search-modal-title');

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            titleAriaId={titleId}
            styles={classNames.subComponentStyles.modal}
            layerProps={{ eventBubblingEnabled: true }}
        >
            <div className={classNames.header}>
                <Icon
                    iconName={'search'}
                    styles={classNames.subComponentStyles.icon}
                />
                {/* TODO: Add translations for this */}
                <h2 id={'titleId'} className={classNames.headerText}>
                    Advanced property search
                </h2>
            </div>
            <div className={classNames.content}>
                <div className={classNames.queryContainer}>
                    <QueryBuilder />
                </div>
                <div className={classNames.resultsContainer}>
                    <AdvancedSearchResults />
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
