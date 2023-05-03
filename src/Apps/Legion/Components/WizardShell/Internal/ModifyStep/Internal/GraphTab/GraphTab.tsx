import React from 'react';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { IGraphTabProps } from './GraphTab.types';
import { getStyles } from './GraphTab.styles';
import UserDefinedEntityForm from '../../../../../UserDefinedEntityForm/UserDefinedEntityForm';
import { PrimaryButton } from '@fluentui/react';
import {
    GraphContextProvider,
    useGraphContext
} from '../../../../../../Contexts/GraphContext/GraphContext';
import { GraphContextActionType } from '../../../../../../Contexts/GraphContext/GraphContext.types';
import {
    DEFAULT_MOCK_GRAPH_PROVIDER_DATA,
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT
} from '../../../../WizardShellMockData';

const debugLogging = false;
const logDebugConsole = getDebugLogger('GraphTab', debugLogging);

const GraphTab: React.FC<IGraphTabProps> = (_props) => {
    // contexts
    // need to add selected state to the data context
    const dataContext = GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT('Dairy');

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getStyles();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <GraphContextProvider
                {...DEFAULT_MOCK_GRAPH_PROVIDER_DATA}
                initialState={{
                    ...DEFAULT_MOCK_GRAPH_PROVIDER_DATA.initialState,
                    isParentFormVisible: false,
                    selectedNodeIds: [
                        dataContext.entities[0].id,
                        dataContext.entities[1].id
                    ]
                }}
            >
                {/* temp till we have the actual graph here */}
                <Content />
            </GraphContextProvider>
        </div>
    );
};

const Content: React.FC = () => {
    const { graphDispatch } = useGraphContext();

    return (
        <>
            <PrimaryButton
                text={'Open form'}
                onClick={() => {
                    graphDispatch({
                        type: GraphContextActionType.PARENT_FORM_MODAL_SHOW,
                        payload: {
                            nodeId: ''
                        }
                    });
                }}
            />
            <UserDefinedEntityForm />
        </>
    );
};

export default GraphTab;
