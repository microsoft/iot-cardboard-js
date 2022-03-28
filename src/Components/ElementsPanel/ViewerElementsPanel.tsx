import React, { memo, useMemo, useRef, useState } from 'react';
import ElementList from './Internal/ElementsList';
import { useTranslation } from 'react-i18next';
import { Icon, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';
import { IViewerElementsPanelProps } from './ViewerElementsPanel.types';
import { getElementsPanelStyles } from './ViewerElementsPanel.styles';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { performSubstitutions } from '../../Models/Services/Utils';
import Draggable from 'react-draggable';

const ViewerElementsPanel: React.FC<IViewerElementsPanelProps> = ({
    panelItems,
    isLoading = false,
    onItemClick,
    onItemHover
}) => {
    const { t } = useTranslation();
    const boundaryRef = useRef<HTMLDivElement>(null);
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
                                  performSubstitutions(
                                      alertVisual.labelExpression,
                                      panelItem.twins
                                  )
                                      .toLowerCase()
                                      .includes(filterTerm.toLowerCase())
                              ).length
                  )
                : panelItems,
        [filterTerm, panelItems]
    );

    return (
        <div ref={boundaryRef} className={elementsPanelStyles.boundaryLayer}>
            <Draggable
                bounds="parent"
                defaultClassName={elementsPanelStyles.draggable}
            >
                <div className={elementsPanelStyles.modalContainer}>
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
                        className={elementsPanelStyles.filterBox}
                    />
                    <ElementList
                        isLoading={isLoading}
                        panelItems={filteredPanelItems}
                        onItemClick={onItemClick}
                        onItemHover={onItemHover}
                        filterTerm={filterTerm}
                    />
                </div>
            </Draggable>
        </div>
    );
};

export default memo(ViewerElementsPanel);
