import {
    DefaultButton,
    Label,
    PrimaryButton,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultTwinAlias,
    ITwinAliasItem
} from '../../../../../Models/Classes/3DVConfig';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { deepCopy } from '../../../../../Models/Services/Utils';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import TwinSearchDropdown from '../../../../TwinSearchDropdown/TwinSearchDropdown';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';
import { BehaviorFormContext } from '../BehaviorsForm';

// Note, this widget form does not currently support panels
const TwinAliasForm: React.FC<{
    selectedElements: Array<ITwinToObjectMapping>;
    setSelectedElements: (elements: Array<ITwinToObjectMapping>) => any;
}> = ({ selectedElements, setSelectedElements }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0);
    const { setBehaviorToEdit } = useContext(BehaviorFormContext);
    const { adapter, twinAliasFormInfo, setTwinAliasFormInfo } = useContext(
        SceneBuilderContext
    );

    const [formData, setFormData] = useState<ITwinAliasItem>(
        twinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
            ? defaultTwinAlias
            : twinAliasFormInfo.twinAlias
    );

    const handleTwinSelect = useCallback(
        (elementId: string, twinId: string) => {
            const editedElementIdx = formData.elementToTwinMappings.findIndex(
                (mapping) => mapping.elementId === elementId
            );
            setFormData(
                produce((draft) => {
                    if (editedElementIdx === -1) {
                        draft.elementToTwinMappings.push({
                            elementId,
                            twinId
                        });
                    } else {
                        draft.elementToTwinMappings[editedElementIdx] = {
                            elementId,
                            twinId
                        };
                    }
                })
            );
        },
        [formData, setFormData]
    );

    const onSaveTwinAliasForm = () => {
        if (twinAliasFormInfo.mode === TwinAliasFormMode.EditTwinAlias) {
            setBehaviorToEdit(
                produce((draft) => {
                    draft.twinAliases[twinAliasFormInfo.twinAliasIdx] =
                        formData.alias;
                })
            );
        }
        if (twinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias) {
            setBehaviorToEdit(
                produce((draft) => {
                    if (!draft.twinAliases) {
                        draft.twinAliases = [formData.alias];
                    } else if (!draft.twinAliases.includes(formData.alias)) {
                        draft.twinAliases.push(formData.alias);
                    }
                })
            );
        }
        const newSelectedElements = deepCopy(selectedElements);
        newSelectedElements?.forEach((selectedElement) => {
            // TODO: move this to viewer config utils
            const aliasedTwinId = formData.elementToTwinMappings.find(
                (mapping) => mapping.elementId === selectedElement.id
            )?.twinId;
            if (aliasedTwinId) {
                if (selectedElement.twinAliases) {
                    if (
                        selectedElement.twinAliases?.[
                            twinAliasFormInfo.twinAlias.alias
                        ]
                    ) {
                        delete selectedElement.twinAliases?.[
                            twinAliasFormInfo.twinAlias.alias
                        ];
                    }
                    selectedElement.twinAliases[formData.alias] = aliasedTwinId;
                } else {
                    selectedElement.twinAliases = {
                        [formData.alias]: aliasedTwinId
                    };
                }
            }
        });
        setSelectedElements(newSelectedElements);
        setTwinAliasFormInfo(null);
        setFormData(null);
    };

    return (
        <>
            <div className={commonFormStyles.content}>
                <TextField
                    label={t('3dSceneBuilder.alias')}
                    value={formData.alias}
                    required
                    onChange={(_ev, newVal) =>
                        setFormData(
                            produce((draft) => {
                                draft.alias = newVal;
                            })
                        )
                    }
                />
                <Label styles={{ root: { paddingTop: 16 } }}>
                    {t('3dSceneBuilder.elementTwinMappings')}
                </Label>
                {selectedElements?.map((element, idx) => (
                    <TwinSearchDropdown
                        key={`aliased-twin-${idx}`}
                        styles={{ paddingBottom: 16 }}
                        adapter={adapter}
                        label={element.displayName}
                        labelIconName="Shapes"
                        selectedTwinId={element.twinAliases?.[formData.alias]}
                        onTwinIdSelect={(selectedTwinId: string) => {
                            handleTwinSelect(element.id, selectedTwinId);
                        }}
                        isDescriptionHidden={true}
                    />
                ))}
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'twin-alias-form-primary-button'}
                    onClick={onSaveTwinAliasForm}
                    text={
                        twinAliasFormInfo.mode ===
                        TwinAliasFormMode.CreateTwinAlias
                            ? t('3dSceneBuilder.createTwinAlias')
                            : t('3dSceneBuilder.updateTwinAlias')
                    }
                    // disabled TODO: implement validations/error check to disable the button
                />
                <DefaultButton
                    data-testid={'twin-alias-form-secondary-button'}
                    text={t('cancel')}
                    onClick={() => {
                        setTwinAliasFormInfo(null);
                        setFormData(null);
                    }}
                />
            </PanelFooter>
        </>
    );
};

export default TwinAliasForm;
