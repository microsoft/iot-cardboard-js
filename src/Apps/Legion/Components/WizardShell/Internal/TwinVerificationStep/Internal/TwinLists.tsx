import { DetailsList, IColumn } from '@fluentui/react';
import React, { useState } from 'react';
import { useWizardNavigationContext } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';

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

export const TwinLists: React.FC<ITwinListsProps> = (_props) => {
    // Contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

    // Helper functions
    const getPropertyNameFromIds = (ids: string[]) => {
        const properties =
            wizardNavigationContextState.stepData.verificationStepData
                .properties;
        const propertyNames = [];
        properties.forEach((p) => {
            if (ids.includes(p.id)) {
                propertyNames.push(p.name);
            }
        });
        return propertyNames.join(', ');
    };

    const initializeTwinList = () => {
        // Generate twin list for details list
        const twins =
            wizardNavigationContextState.stepData.verificationStepData.twins;
        const models =
            wizardNavigationContextState.stepData.verificationStepData.models;
        if (twins) {
            const twinDetails = twins.map((t) => {
                const twinModel = models.find((m) => m.id === t.modelId);
                const twinModelName = twinModel ? twinModel.name : 'Unknown';
                return {
                    key: `${t.id}_${Date.now()}`,
                    id: t.id,
                    model: twinModelName,
                    properties: twinModel
                        ? getPropertyNameFromIds(twinModel.propertyIds)
                        : ''
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

    return <DetailsList items={twinList} columns={columns} />;
};
