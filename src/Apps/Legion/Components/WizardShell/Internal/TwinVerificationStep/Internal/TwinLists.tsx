import { DetailsList, IColumn, Selection } from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { useWizardDataManagementContext } from '../../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import {
    getViewModelsFromCookedAssets,
    getViewTwinsFromCookedAssets
} from '../../../../../Services/DataPusherUtils';
import { twinListsStyle } from './TwinLists.styles';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITwinListsProps {}

const columns: IColumn[] = [
    {
        key: 'id-column',
        minWidth: 100,
        name: 'ID',
        fieldName: 'id'
    },
    {
        key: 'model-color-column',
        minWidth: 20,
        name: '',
        fieldName: 'modelColor'
    },
    {
        key: 'model-column',
        minWidth: 100,
        name: 'Model',
        fieldName: 'model'
    },
    {
        key: 'property-column',
        minWidth: 400,
        name: 'Properties',
        fieldName: 'properties'
    }
];

/** THIS FILE WILL BE HEAVILY MODIFIED SO I'LL leave data mgmt for a following PR */
export const TwinLists: React.FC<ITwinListsProps> = (_props) => {
    // Contexts
    const {
        wizardDataManagementContextState
    } = useWizardDataManagementContext();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectedTwinIndices, setSelectedTwinIndices] = useState<number[]>();
    const selection = useRef<Selection>(
        new Selection({
            onSelectionChanged: () => {
                const selectedIndices = selection.current.getSelectedIndices();
                setSelectedTwinIndices(selectedIndices);
            }
        })
    );

    const properties =
        wizardDataManagementContextState.modifiedAssets.properties;

    const initializeTwinList = () => {
        // Generate twin list for details list
        const viewModels = getViewModelsFromCookedAssets(
            wizardDataManagementContextState.modifiedAssets.models
        );
        const twins = getViewTwinsFromCookedAssets(
            wizardDataManagementContextState.modifiedAssets.twins,
            viewModels
        );
        if (twins) {
            const twinDetails = twins.map((t) => {
                return {
                    key: `${t.id}_${Date.now()}`,
                    id: t.id,
                    modelColor: (
                        <div
                            className={twinListsStyle.dot}
                            style={{
                                background: t.model.color
                            }}
                        />
                    ),
                    model: t.model.name ?? t.model.id,
                    properties: t.model.propertyIds
                        .map(
                            (modelPropertyId) =>
                                properties.find((p) => p.id === modelPropertyId)
                                    .name
                        )
                        .join(',')
                };
            });
            return twinDetails;
        } else {
            return [];
        }
    };

    // State
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [twinList, setTwinList] = useState(initializeTwinList());

    return (
        <DetailsList
            items={twinList}
            columns={columns}
            selection={selection.current}
        />
    );
};
