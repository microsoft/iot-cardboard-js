import {
    DefaultButton,
    Label,
    mergeStyleSets,
    PrimaryButton,
    Text,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultBehaviorTwinAlias,
    IBehaviorTwinAliasItem
} from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { deepCopy } from '../../../../../Models/Services/Utils';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import TwinSearchDropdown from '../../../../TwinSearchDropdown/TwinSearchDropdown';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';

const BehaviorTwinAliasForm: React.FC<{
    selectedElements: Array<ITwinToObjectMapping>;
    setSelectedElements: (elements: Array<ITwinToObjectMapping>) => any;
}> = ({ selectedElements, setSelectedElements }) => {
    const { t } = useTranslation();
    const {
        adapter,
        config,
        sceneId,
        behaviorTwinAliasFormInfo,
        setBehaviorTwinAliasFormInfo,
        setBehaviorToEdit
    } = useContext(SceneBuilderContext);

    const [formData, setFormData] = useState<IBehaviorTwinAliasItem>(
        behaviorTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
            ? defaultBehaviorTwinAlias
            : behaviorTwinAliasFormInfo.twinAlias
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
        if (
            behaviorTwinAliasFormInfo.mode === TwinAliasFormMode.EditTwinAlias
        ) {
            setBehaviorToEdit(
                produce((draft) => {
                    draft.twinAliases[behaviorTwinAliasFormInfo.twinAliasIdx] =
                        formData.alias;
                })
            );
        }
        if (
            behaviorTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
        ) {
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
        setBehaviorTwinAliasFormInfo(null);
        setFormData(null);
    }, [
        behaviorTwinAliasFormInfo.mode,
        behaviorTwinAliasFormInfo.twinAliasIdx,
        formData.alias,
        formData.elementToTwinMappings,
        selectedElements,
        setBehaviorToEdit,
        setBehaviorTwinAliasFormInfo,
        setSelectedElements
    ]);

    const showAliasExistsErrorMessage = useMemo(() => {
        const existingTwinAliasNames = ViewerConfigUtility.getAvailableBehaviorTwinAliasItemsBySceneAndElements(
            config,
            sceneId,
            selectedElements
        )?.map((twinAliasItem) => twinAliasItem.alias);
        return (
            behaviorTwinAliasFormInfo.mode ===
                TwinAliasFormMode.CreateTwinAlias &&
            existingTwinAliasNames.includes(formData.alias)
        );
    }, [
        config,
        sceneId,
        selectedElements,
        behaviorTwinAliasFormInfo,
        formData
    ]);

    useEffect(() => {
        const isValid =
            formData.alias &&
            !showAliasExistsErrorMessage &&
            formData.elementToTwinMappings?.length ===
                selectedElements?.length &&
            !formData.elementToTwinMappings.some((mapping) => !mapping.twinId);
        setIsFormValid(isValid);
    }, [formData, selectedElements, showAliasExistsErrorMessage]);

    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0);
    const commonPanelStyles = getLeftPanelStyles(theme);
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
                        behaviorTwinAliasFormInfo.mode ===
                        TwinAliasFormMode.EditTwinAlias
                    }
                    description={t(
                        '3dSceneBuilder.twinAlias.descriptions.aliasChangeNotAllowed'
                    )}
                />
                {showAliasExistsErrorMessage && (
                    <div className={styles.errorMessage}>
                        {t(
                            '3dSceneBuilder.twinAlias.errors.twinAliasAlreadyExists'
                        )}
                    </div>
                )}
                <div className={styles.elementTwinMappingsSection}>
                    <Label>
                        {t(
                            '3dSceneBuilder.twinAlias.twinAliasForm.elementTwinMappings'
                        )}
                    </Label>
                    <div className={styles.elementTwinMappingsWrapper}>
                        {!selectedElements || selectedElements.length === 0 ? (
                            <Text className={commonPanelStyles.text}>
                                {t(
                                    '3dSceneBuilder.twinAlias.twinAliasForm.elementTwinMappingsNotExist'
                                )}
                            </Text>
                        ) : (
                            selectedElements?.map((element, idx) => (
                                <TwinSearchDropdown
                                    key={`aliased-twin-${idx}`}
                                    styles={{ paddingBottom: 16 }}
                                    adapter={adapter}
                                    label={element.displayName}
                                    labelIconName="Shapes"
                                    selectedTwinId={
                                        element.twinAliases?.[formData.alias]
                                    }
                                    onTwinIdSelect={(
                                        selectedTwinId: string
                                    ) => {
                                        handleTwinSelect(
                                            element.id,
                                            selectedTwinId
                                        );
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'twin-alias-form-primary-button'}
                    onClick={onSaveTwinAliasForm}
                    text={
                        behaviorTwinAliasFormInfo.mode ===
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
                        setBehaviorTwinAliasFormInfo(null);
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
    },
    errorMessage: {
        color: 'var(--cb-color-text-danger)',
        fontSize: 12,
        marginTop: 2
    }
});

export default BehaviorTwinAliasForm;
