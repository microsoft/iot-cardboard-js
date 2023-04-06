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
import { useWizardNavigationContext } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('RelationshipBuilderStep', debugLogging);

const getClassNames = classNamesFunction<
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
>();

const mockData: IGraphNode<any>[] = [
    {
        id: '1',
        label: 'Node 1',
        icon: 'CircleRing',
        color: 'red',
        data: { property1: 'something' }
    },
    {
        id: '2',
        label: 'Node 2',
        icon: 'CircleRing',
        color: 'blue',
        data: { property1: 'something' }
    },
    {
        id: '3',
        label: 'Node 3',
        icon: 'CircleRing',
        color: 'red',
        data: { property1: 'something' }
    },
    {
        id: '4',
        label: 'Node 4',
        icon: 'CircleRing',
        color: 'yellow',
        data: { property1: 'something' }
    },
    {
        id: '5',
        label: 'Node 5',
        icon: 'CircleRing',
        color: 'yellow',
        data: { property1: 'something' }
    }
];

const RelationshipBuilderStep: React.FC<IRelationshipBuilderStepProps> = (
    props
) => {
    const { styles } = props;

    // contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

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
            wizardNavigationContextState.stepData?.verificationStepData
                ?.twins ?? [];
        const nodes: IGraphNode<any>[] = models.map((x) => {
            return {
                id: x.id,
                label: x.id,
                color: x.model.color,
                data: x
            };
        });
        return nodes;
    }, [wizardNavigationContextState.stepData?.verificationStepData?.twins]);

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <GraphContextProvider nodeData={data}>
                <GraphVisualizer />
            </GraphContextProvider>
        </div>
    );
};

export default styled<
    IRelationshipBuilderStepProps,
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
>(RelationshipBuilderStep, getStyles);
