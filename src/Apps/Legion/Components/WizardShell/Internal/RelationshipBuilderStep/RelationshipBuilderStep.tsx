import React, { useMemo } from 'react';
import {
    IRelationshipBuilderStepProps,
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
} from './RelationshipBuilderStep.types';
import { getStyles } from './RelationshipBuilderStep.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import GraphVisualizer from '../../../GraphVisualizer/GraphVisualizer';
import { GraphContextProvider } from '../../../../Contexts/GraphContext/GraphContext';
import { IGraphNode } from '../../../../Contexts/GraphContext/GraphContext.types';
import { useWizardDataManagementContext } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import {
    getViewModelsFromCookedAssets,
    getViewTwinsFromCookedAssets
} from '../../../../Services/DataPusherUtils';
import UserDefinedEntityForm from '../../../UserDefinedEntityForm/UserDefinedEntityForm';

const debugLogging = false;
const logDebugConsole = getDebugLogger('RelationshipBuilderStep', debugLogging);

const getClassNames = classNamesFunction<
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
>();

const RelationshipBuilderStep: React.FC<IRelationshipBuilderStepProps> = (
    props
) => {
    const { styles } = props;

    // contexts
    const {
        wizardDataManagementContextState
    } = useWizardDataManagementContext();

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // data
    const data: IGraphNode<any>[] = useMemo(() => {
        const models =
            getViewModelsFromCookedAssets(
                wizardDataManagementContextState.modifiedAssets.models
            ) ?? [];
        const twins =
            getViewTwinsFromCookedAssets(
                wizardDataManagementContextState.modifiedAssets.twins,
                models
            ) ?? [];
        const nodes: IGraphNode<any>[] = twins.map((x) => {
            return {
                id: x.id,
                label: x.id,
                color: x.model.color,
                data: x
            };
        });
        return nodes;
    }, [
        wizardDataManagementContextState.modifiedAssets.models,
        wizardDataManagementContextState.modifiedAssets.twins
    ]);

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <GraphContextProvider nodeData={data}>
                <GraphVisualizer />
                <UserDefinedEntityForm />
            </GraphContextProvider>
        </div>
    );
};

export default styled<
    IRelationshipBuilderStepProps,
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
>(RelationshipBuilderStep, getStyles);
