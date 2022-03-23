import React, { memo, useMemo, useState } from 'react';
import ElementList from './Internal/ElementsList';
import { useTranslation } from 'react-i18next';
import { Icon, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';
import { ViewerElementsPanelProps } from './ViewerElementsPanel.types';
import { getElementsPanelStyles } from './ViewerElementsPanel.styles';
import BaseComponent from '../BaseComponent/BaseComponent';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';

const ViewerElementsPanel: React.FC<ViewerElementsPanelProps> = ({
    baseComponentProps,
    panelItems,
    isLoading = false,
    onItemClick,
    onItemHover
}) => {
    const { t } = useTranslation();
    const elementsPanelStyles = getElementsPanelStyles();
    const [filterTerm, setFilterTerm] = useState('');

    const filteredPanelItems = useMemo(
        () =>
            filterTerm
                ? panelItems.filter(
                      (panelItem) =>
                          panelItem.element.displayName
                              .toLowerCase()
                              .includes(filterTerm.toLowerCase()) ||
                          []
                              .concat(
                                  ...panelItem.behaviors.map((b) => b.visuals)
                              )
                              .filter(ViewerConfigUtility.isAlertVisual)
                              .filter((alertVisual) =>
                                  alertVisual.labelExpression
                                      .toLowerCase()
                                      .includes(filterTerm.toLowerCase())
                              ).length
                  )
                : panelItems,
        [filterTerm, panelItems]
    );

    return (
        <BaseComponent {...baseComponentProps}>
            <div className={elementsPanelStyles.container}>
                <div className={elementsPanelStyles.containerBackdrop}></div>
                <div className={elementsPanelStyles.header}>
                    <Icon
                        iconName="BulletedTreeList"
                        style={{ fontSize: 16 }}
                    />
                    <span className={elementsPanelStyles.title}>
                        {t('elementsPanel.title')}
                    </span>
                    {isLoading && <Spinner size={SpinnerSize.small} />}
                </div>
                <SearchBox
                    placeholder={t('elementsPanel.filterPlaceholder')}
                    onChange={(_e, value) => setFilterTerm(value)}
                    value={filterTerm}
                    className={elementsPanelStyles.searchBox}
                />
                <ElementList
                    panelItems={filteredPanelItems}
                    onItemClick={onItemClick}
                    onItemHover={onItemHover}
                    filterTerm={filterTerm}
                />
            </div>
        </BaseComponent>
    );
};

export default memo(ViewerElementsPanel);
