import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Separator, TextField } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../Models/Hooks/useExtendedTheme';
import { getModelListsStyles } from './ModelLists.styles';
import { useTranslation } from 'react-i18next';
import { IModel, IModelProperty } from '../../../../../Models/Interfaces';
import { useWizardDataManagementContext } from '../../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { IModelExtended } from '../TwinVerificationStep.types';
import { getHighChartColorByIdx } from '../../../../../../../Models/SharedUtils/DataHistoryUtils';
import { deepCopy } from '../../../../../../../Models/Services/Utils';
import { WizardDataManagementContextActionType } from '../../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IModelListsProps {}

// TODO: Move to utils
const buildViewModel = (initialModels: IModel[], currentModels: IModel[]) => {
    const viewModels: IModelExtended[] = [];
    initialModels.forEach((im, index) => {
        // Find intersection to get selected property ids
        const selectedPropertyIds = im.propertyIds.filter((property) =>
            currentModels[index].propertyIds.includes(property)
        );
        viewModels.push({
            ...im,
            selectedPropertyIds,
            color: getHighChartColorByIdx(index)
        });
    });

    return viewModels;
};

export const ModelLists: React.FC<IModelListsProps> = (_props) => {
    // Contexts
    const {
        wizardDataManagementContextState,
        wizardDataManagementContextDispatch
    } = useWizardDataManagementContext();

    // Hooks
    const { t } = useTranslation();
    const { palette } = useExtendedTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [properties, _setProperties] = useState<IModelProperty[]>(
        wizardDataManagementContextState.modifiedAssets.properties
    );
    const [models, setModels] = useState<IModelExtended[]>(
        buildViewModel(
            wizardDataManagementContextState.initialAssets.models,
            wizardDataManagementContextState.modifiedAssets.models
        )
    );

    useEffect(() => {
        // onUnmount update assets
        return () => {
            wizardDataManagementContextDispatch({
                type: WizardDataManagementContextActionType.SET_MODIFIED_ASSETS,
                payload: {
                    data: {
                        ...wizardDataManagementContextState.modifiedAssets,
                        models,
                        properties
                    }
                }
            });
        };
    }, [
        wizardDataManagementContextDispatch,
        wizardDataManagementContextState.modifiedAssets,
        models,
        properties
    ]);

    // Styles
    const style = useMemo(() => getModelListsStyles(palette), [palette]);

    //callbacks
    const handleOnCheck = useCallback(
        (modelId: string, propertyId: string, checked: boolean) => {
            const tempModels = deepCopy(models);
            const modelToModifyIdx = tempModels.findIndex(
                (m) => m.id === modelId
            );
            if (modelToModifyIdx >= 0) {
                if (checked) {
                    tempModels[modelToModifyIdx].propertyIds.push(propertyId);
                } else {
                    tempModels[modelToModifyIdx].propertyIds.filter(
                        (p) => p !== propertyId
                    );
                }
            }
            setModels(tempModels);
        },
        [models]
    );

    const handleModelNameChange = useCallback(
        (modelId: string, modelName: string) => {
            const tempModels = deepCopy(models);
            const modelToModifyIdx = tempModels.findIndex(
                (m) => m.id === modelId
            );
            if (modelToModifyIdx >= 0) {
                tempModels[modelToModifyIdx].name = modelName;
            }
            setModels(tempModels);
        },
        [models]
    );

    return (
        <div className={style.root}>
            {models.map((m) => {
                return (
                    <div key={m.id} className={style.tableContainer}>
                        <div className={style.leftContainer}>
                            <div
                                className={style.dot}
                                style={{
                                    background: m.color
                                }}
                            />
                            <TextField
                                value={m.name}
                                onBlur={() =>
                                    handleModelNameChange(m.id, m.name)
                                }
                            />
                        </div>
                        <Separator vertical={true} />
                        <div>
                            <p className={style.rightContainerText}>
                                {t('legionApp.verificationStep.properties')}
                            </p>
                            <div className={style.checkboxContainer}>
                                {m.propertyIds.map((modelPropertyId) => {
                                    return (
                                        <Checkbox
                                            key={`${m.id}-${modelPropertyId}`}
                                            label={
                                                properties.find(
                                                    (p) =>
                                                        p.id === modelPropertyId
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
            })}
        </div>
    );
};
