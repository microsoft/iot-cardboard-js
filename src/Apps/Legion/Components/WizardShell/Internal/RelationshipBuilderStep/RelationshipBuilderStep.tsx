import React from 'react';
import {
    IRelationshipBuilderStepProps,
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
} from './RelationshipBuilderStep.types';
import { getStyles } from './RelationshipBuilderStep.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';

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

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>Hello RelationshipBuilderStep!</div>
    );
};

export default styled<
    IRelationshipBuilderStepProps,
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
>(RelationshipBuilderStep, getStyles);
