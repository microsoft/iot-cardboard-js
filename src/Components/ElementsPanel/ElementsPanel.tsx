import React, { memo, useMemo, useState } from 'react';
import { IAlertVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ElementList from './Internal/ElementList';
import { useTranslation } from 'react-i18next';
import {
    Icon,
    SearchBox,
    Separator,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { ElementsPanelProps } from './ElementsPanel.types';
import { getElementsPanelStyles } from './ElementsPanel.styles';
import BaseComponent from '../BaseComponent/BaseComponent';

const ElementsPanel: React.FC<ElementsPanelProps> = ({
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
                          panelItem.visuals
                              .filter((visual) => visual.type === 'Alert')
                              .filter((alertVisual: IAlertVisual) =>
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
                    <Icon iconName="Ringer" />
                    <span className={elementsPanelStyles.title}>
                        {t('elementsPanel.title')}
                    </span>
                    {isLoading && <Spinner size={SpinnerSize.small} />}
                </div>
                <Separator className={elementsPanelStyles.separator} />
                <SearchBox
                    placeholder={t('elementsPanel.filter')}
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

export default memo(ElementsPanel);
