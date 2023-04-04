import React, { useCallback } from 'react';
import { Checkbox, mergeStyleSets, Separator } from '@fluentui/react';
import { useWizardNavigationContext } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { useExtendedTheme } from '../../../../../../../Models/Hooks/useExtendedTheme';
import { WizardNavigationContextActionType } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IModelListsProps {}

export const ModelLists: React.FC<IModelListsProps> = (_props) => {
    // Contexts
    const {
        wizardNavigationContextState,
        wizardNavigationContextDispatch
    } = useWizardNavigationContext();

    // Hooks
    const { palette } = useExtendedTheme();

    // Style
    const style = mergeStyleSets({
        root: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 16,
            paddingTop: 8
        },
        tableContainer: {
            display: 'flex',
            columnGap: 8,
            border: `1px solid ${palette.glassyBorder}`,
            background: `${palette.glassyBackground75}`,
            padding: 16
        },
        // Model side
        leftContainer: {
            display: 'flex',
            alignItems: 'center',
            columnGap: 4
        },
        modelNameText: {
            margin: 0
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4
        },
        // Property side
        checkboxContainer: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 8
        }
    });

    //callbacks
    const handleOnCheck = useCallback(
        (modelId: string, propertyId: string, checked: boolean) => {
            wizardNavigationContextDispatch({
                type:
                    WizardNavigationContextActionType.SET_MODEL_PROPERTY_SELECTED,
                payload: { modelId, propertyId, checked }
            });
        },
        [wizardNavigationContextDispatch]
    );

    return (
        <div className={style.root}>
            {wizardNavigationContextState.stepData.verificationStepData.models?.map(
                (m) => {
                    const properties =
                        wizardNavigationContextState.stepData
                            .verificationStepData.properties;

                    return (
                        <div key={m.id} className={style.tableContainer}>
                            <div className={style.leftContainer}>
                                <div
                                    className={style.dot}
                                    style={{
                                        background: m.color
                                    }}
                                />
                                <p className={style.modelNameText}>{m.name}</p>
                            </div>
                            <Separator vertical={true} />
                            <div>
                                <p>Properties</p>
                                <div className={style.checkboxContainer}>
                                    {m.propertyIds.map((modelPropertyId) => {
                                        return (
                                            <Checkbox
                                                key={`${m.id}-${modelPropertyId}`}
                                                label={
                                                    properties.find(
                                                        (p) =>
                                                            p.id ===
                                                            modelPropertyId
                                                    ).name
                                                }
                                                defaultChecked={m.selectedPropertyIds.includes(
                                                    modelPropertyId
                                                )}
                                                onChange={(
                                                    _ev,
                                                    checked?: boolean
                                                ) =>
                                                    handleOnCheck(
                                                        m.id,
                                                        modelPropertyId,
                                                        checked
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};
