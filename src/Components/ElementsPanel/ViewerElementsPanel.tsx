import React, { memo, useMemo, useRef, useState } from 'react';
import ElementList from './Internal/ElementsList';
import { useTranslation } from 'react-i18next';
import { Icon, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';
import { IViewerElementsPanelProps } from './ViewerElementsPanel.types';
import { getElementsPanelStyles } from './ViewerElementsPanel.styles';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import Draggable from 'react-draggable';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression
} from '../../Models/Services/Utils';
import VisualRuleElementsList from './Internal/VisualRuleElementsList';
import { LOCAL_STORAGE_KEYS } from '../../Models/Constants/Constants';

const showVisualRulesFeature =
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.VisualRules.showVisualRulesFeature
    ) === 'true';

const ViewerElementsPanel: React.FC<IViewerElementsPanelProps> = ({
    panelItems,
    isLoading = false,
    onItemClick,
    onItemHover,
    onItemBlur
}) => {
    const { t } = useTranslation();
    const boundaryRef = useRef<HTMLDivElement>(null);
    const elementsPanelStyles = getElementsPanelStyles();
    const [filterTerm, setFilterTerm] = useState('');
    const nodeRef = React.useRef(null); // <Draggable> requires an explicit ref to avoid using findDOMNode

    const getVisualRulesIncludingFilterTerm = (panelItem) => {
        // Map all visuals from existing behaviors
        const visuals = [].concat(...panelItem.behaviors.map((b) => b.visuals));
        // Filter out widgets
        const visualRules = visuals.filter(ViewerConfigUtility.isVisualRule);
        // Check all conditions in case their label expressions contain the search term
        const includedVisualRules = visualRules.filter(
            (visualRule) =>
                visualRule.valueRanges.filter((condition) => {
                    return parseLinkedTwinExpression(
                        wrapTextInTemplateString(
                            condition.visual.labelExpression
                        ),
                        panelItem.twins
                    )
                        .toLowerCase()
                        .includes(filterTerm.toLowerCase());
                }).length > 0
        );
        return includedVisualRules.length;
    };

    const filteredPanelItems = useMemo(
        () =>
            filterTerm
                ? panelItems.filter(
                      (panelItem) =>
                          panelItem.element.displayName
                              .toLowerCase()
                              .includes(filterTerm.toLowerCase()) ||
                          getVisualRulesIncludingFilterTerm(panelItem)
                  )
                : panelItems,
        [filterTerm, panelItems]
    );

    return (
        <div ref={boundaryRef} className={elementsPanelStyles.boundaryLayer}>
            <Draggable
                nodeRef={nodeRef}
                bounds="parent"
                defaultClassName={elementsPanelStyles.draggable}
            >
                <div
                    ref={nodeRef}
                    className={elementsPanelStyles.modalContainer}
                >
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
                    {showVisualRulesFeature ? (
                        <VisualRuleElementsList
                            isLoading={isLoading}
                            isModal={false}
                            panelItems={filteredPanelItems}
                            onItemClick={onItemClick}
                            onItemHover={onItemHover}
                            onItemBlur={onItemBlur}
                            filterTerm={filterTerm}
                        />
                    ) : (
                        <ElementList
                            isLoading={isLoading}
                            panelItems={filteredPanelItems}
                            onItemClick={onItemClick}
                            onItemHover={onItemHover}
                            onItemBlur={onItemBlur}
                            filterTerm={filterTerm}
                        />
                    )}
                </div>
            </Draggable>
        </div>
    );
};

export default memo(ViewerElementsPanel);
