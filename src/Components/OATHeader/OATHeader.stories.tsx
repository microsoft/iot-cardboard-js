import React from 'react';
import OATHeader from './OATHeader';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import { Label, Separator, Stack } from '@fluentui/react';
import { getOntologiesFromStorage } from '../../Models/Services/OatUtils';

export default {
    title: 'Components - OAT/OATHeader',
    component: OATHeader
};

const ContextRenderer: React.FC = () => {
    const { oatPageState } = useOatPageContext();
    return (
        <>
            <Stack tokens={{ childrenGap: 8 }}>
                <Stack tokens={{ childrenGap: 8 }}>
                    <h4>Ontologies in storage:</h4>
                    {getOntologiesFromStorage().map((x) => {
                        return (
                            <div>
                                {x.id}: {x.data.projectName}
                            </div>
                        );
                    })}
                </Stack>
                <Separator />
                <Stack tokens={{ childrenGap: 8 }}>
                    <h4>Current ontology</h4>
                    <div>
                        <Label>OntologyId:</Label> {oatPageState.ontologyId}
                    </div>
                    <div>
                        <Label>Ontology name:</Label> {oatPageState.projectName}
                    </div>
                    <div>
                        <Label>Namespace:</Label> {oatPageState.namespace}
                    </div>
                    <div>
                        <Label>Models:</Label>{' '}
                        {JSON.stringify(oatPageState.models || [])}
                    </div>
                    <div>
                        <Label>Positions:</Label>{' '}
                        {JSON.stringify(oatPageState.modelPositions || [])}
                    </div>
                    <div>
                        <Label>Templates:</Label>{' '}
                        {JSON.stringify(oatPageState.templates || [])}
                    </div>
                </Stack>
            </Stack>
        </>
    );
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider
                initialState={{
                    namespace: 'oat header test namespace',
                    projectName: 'oat header test project name',
                    ontologyId: 'testId'
                }}
            >
                <CommandHistoryContextProvider>
                    <OATHeader />
                    <ContextRenderer />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
