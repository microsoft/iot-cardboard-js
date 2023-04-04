import {
    DetailsList,
    IColumn,
    mergeStyleSets,
    Selection
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { useWizardNavigationContext } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';

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

export const TwinLists: React.FC<ITwinListsProps> = (_props) => {
    // Contexts
    const {
        wizardNavigationContextState,
        wizardNavigationContextDispatch
    } = useWizardNavigationContext();

    const selection = useRef<Selection>(
        new Selection({
            onSelectionChanged: () => {
                const selectedIndices = selection.current.getSelectedIndices();
                wizardNavigationContextDispatch({
                    type: WizardNavigationContextActionType.SET_SELECTED_TWINS,
                    payload: { selectedTwinIndices: selectedIndices }
                });
            }
        })
    );

    // Style
    const style = mergeStyleSets({
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4
        }
    });

    const properties =
        wizardNavigationContextState.stepData.verificationStepData.properties;

    const initializeTwinList = () => {
        // Generate twin list for details list
        const twins =
            wizardNavigationContextState.stepData.verificationStepData.twins;
        if (twins) {
            const twinDetails = twins.map((t) => {
                return {
                    key: `${t.id}_${Date.now()}`,
                    id: t.id,
                    modelColor: (
                        <div
                            className={style.dot}
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
