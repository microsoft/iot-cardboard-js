import {
    DefaultButton,
    Label,
    mergeStyleSets,
    PrimaryButton,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultTwinAlias,
    ITwinAliasItem
} from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
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
    const [isFormValid, setIsFormValid] = useState(false);

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

    const onSaveTwinAliasForm = useCallback(() => {
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

        // update the twinAliases in selected elements
        const newSelectedElements = deepCopy(selectedElements);
        newSelectedElements?.forEach((selectedElement) => {
            const aliasedTwinId = formData.elementToTwinMappings.find(
                (mapping) => mapping.elementId === selectedElement.id
            )?.twinId;
            ViewerConfigUtility.addTwinAliasToElement(
                selectedElement,
                formData.alias,
                aliasedTwinId
            );
        });
        setSelectedElements(newSelectedElements);
        setTwinAliasFormInfo(null);
        setFormData(null);
    }, [twinAliasFormInfo, formData, selectedElements]);

    useEffect(() => {
        const isValid =
            formData.alias &&
            formData.elementToTwinMappings.length === selectedElements.length &&
            !formData.elementToTwinMappings.some((mapping) => !mapping.twinId);
        setIsFormValid(isValid);
    }, [formData, selectedElements]);

    return (
        <>
            <div className={commonFormStyles.content}>
                <TextField
                    label={t('3dSceneBuilder.twinAlias.twinAliasForm.alias')}
                    value={formData.alias}
                    required
                    onChange={(_ev, newVal) =>
                        setFormData(
                            produce((draft) => {
                                draft.alias = newVal;
                            })
                        )
                    }
                    disabled={
                        twinAliasFormInfo.mode ===
                        TwinAliasFormMode.EditTwinAlias
                    }
                    description={t(
                        '3dSceneBuilder.twinAlias.descriptions.aliasChangeNotAllowed'
                    )}
                />
                <div className={styles.elementTwinMappingsSection}>
                    <Label>
                        {t(
                            '3dSceneBuilder.twinAlias.twinAliasForm.elementTwinMappings'
                        )}
                    </Label>
                    <div className={styles.elementTwinMappingsWrapper}>
                        {selectedElements?.map((element, idx) => (
                            <TwinSearchDropdown
                                key={`aliased-twin-${idx}`}
                                styles={{ paddingBottom: 16 }}
                                adapter={adapter}
                                label={element.displayName}
                                labelIconName="Shapes"
                                selectedTwinId={
                                    element.twinAliases?.[formData.alias]
                                }
                                onTwinIdSelect={(selectedTwinId: string) => {
                                    handleTwinSelect(
                                        element.id,
                                        selectedTwinId
                                    );
                                }}
                                isDescriptionHidden={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'twin-alias-form-primary-button'}
                    onClick={onSaveTwinAliasForm}
                    text={
                        twinAliasFormInfo.mode ===
                        TwinAliasFormMode.CreateTwinAlias
                            ? t('3dSceneBuilder.twinAlias.create')
                            : t('3dSceneBuilder.twinAlias.update')
                    }
                    disabled={!isFormValid}
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

const styles = mergeStyleSets({
    elementTwinMappingsSection: {
        paddingTop: 16,
        overflow: 'auto'
    },
    elementTwinMappingsWrapper: {
        overflowX: 'hidden',
        overflowY: 'auto',
        '.cb-search-autocomplete-container': {
            position: 'unset !important'
        }
    }
});

export default TwinAliasForm;
