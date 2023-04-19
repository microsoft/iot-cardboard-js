import React, { useState } from 'react';
import { IModifyStepProps } from './ModifyStep.types';
import { getStyles } from './ModifyStep.styles';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { Pivot, PivotItem, ScrollablePane, Stack } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';
import {
    IWizardAction,
    WizardStepNumber
} from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import EntitiesTab from './Internal/EntitiesTab/EntitiesTab';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ModifyStep', debugLogging);

enum PivotKeys {
    Diagram = 'Diagram',
    Entities = 'Entities',
    Types = 'Types',
    Graph = 'Graph'
}

const ModifyStep: React.FC<IModifyStepProps> = (props) => {
    // hooks
    const { t } = useTranslation();

    /** Register wizard buttons */
    const secondaryActions: IWizardAction[] = [
        {
            disabled: false,
            onClick: () => {
                console.log('Open modal here');
            },
            iconName: 'AutoEnhanceOn',
            text: t('legionApp.modifyStep.secondaryButton')
        }
    ];
    useCustomNavigation(WizardStepNumber.Modify, null, secondaryActions);

    // contexts

    // state
    const [selectedKey, setSelectedKey] = useState<PivotKeys>(
        PivotKeys.Entities
    );

    // callbacks
    const onPivotClick = (item: PivotItem) => {
        const selectedPivot = item.props.itemKey as PivotKeys;
        if (selectedPivot == selectedKey) {
            return;
        }
        setSelectedKey(selectedPivot);
    };

    // side effects

    // styles
    const classNames = getStyles;

    logDebugConsole('debug', 'Render');

    return (
        <Stack className={classNames.root}>
            <Pivot selectedKey={selectedKey} onLinkClick={onPivotClick}>
                {/* Diagram */}
                {props.showDiagram && (
                    <PivotItem
                        title={t('legionApp.modifyStep.diagram')}
                        headerText={t('legionApp.modifyStep.diagram')}
                        itemKey={PivotKeys.Diagram}
                    >
                        <p>TODO: Insert diagram here</p>
                    </PivotItem>
                )}
                {/* Entities */}
                <PivotItem
                    title={t('legionApp.modifyStep.entities')}
                    headerText={t('legionApp.modifyStep.entities')}
                    itemKey={PivotKeys.Entities}
                >
                    <EntitiesTab />
                </PivotItem>
                {/* Types */}
                <PivotItem
                    title={t('legionApp.modifyStep.types')}
                    headerText={t('legionApp.modifyStep.types')}
                    itemKey={PivotKeys.Types}
                >
                    <p>TODO: Insert types screen here</p>
                </PivotItem>
                {/* Graph */}
                <PivotItem
                    title={t('legionApp.modifyStep.graph')}
                    headerText={t('legionApp.modifyStep.graph')}
                    itemKey={PivotKeys.Graph}
                >
                    <p>TODO: Insert graph here</p>
                </PivotItem>
            </Pivot>
        </Stack>
    );
};

export default ModifyStep;
