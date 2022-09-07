import {
    DefaultButton,
    ITextFieldProps,
    Label,
    mergeStyleSets,
    PrimaryButton,
    Stack,
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
import {
    DTID_PROPERTY_NAME,
    TwinAliasFormMode
} from '../../../../../Models/Constants';
import { useBehaviorFormContext } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';
import { deepCopy } from '../../../../../Models/Services/Utils';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import TooltipCallout from '../../../../TooltipCallout/TooltipCallout';
import TwinPropertySearchDropdown from '../../../../TwinSearchPropertyDropdown/TwinPropertySearchDropdown';
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
        setBehaviorTwinAliasFormInfo
    } = useContext(SceneBuilderContext);
    const { behaviorFormDispatch } = useBehaviorFormContext();

    const getDefaultBehaviorTwinAlias = (aliasToAutoPopulate?: string) => {
        const newBehaviorTwinAlias = deepCopy(defaultBehaviorTwinAlias);
        if (aliasToAutoPopulate) {
            newBehaviorTwinAlias.alias = aliasToAutoPopulate;
        }
        return newBehaviorTwinAlias;
    };
    const [formData, setFormData] = useState<IBehaviorTwinAliasItem>(
        behaviorTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
            ? getDefaultBehaviorTwinAlias(
                  behaviorTwinAliasFormInfo.aliasToAutoPopulate // this is set as search text when there is no results in AddTwinAliasCallout to prefill in creating a new twin alias
              )
            : behaviorTwinAliasFormInfo.twinAlias
    );
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
            behaviorTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
        ) {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD,
                payload: {
                    alias: formData.alias
                }
            });
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
        behaviorFormDispatch,
        behaviorTwinAliasFormInfo.mode,
        formData.alias,
        formData.elementToTwinMappings,
        selectedElements,
        setBehaviorTwinAliasFormInfo,
        setSelectedElements
    ]);

    const onRenderLabel = useCallback(
        (
            props?: ITextFieldProps,
            defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
        ): JSX.Element => {
            return (
                <Stack horizontal verticalAlign={'center'}>
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                '3dSceneBuilder.twinAlias.twinAliasForm.aliasNameTooltipContent'
                            ),
                            calloutContent: t(
                                '3dSceneBuilder.twinAlias.twinAliasForm.aliasNameTooltipContent'
                            )
                        }}
                    />
                </Stack>
            );
        },
        [t]
    );

    const existingTwinAliasNames = useMemo(
        () =>
            ViewerConfigUtility.getAvailableBehaviorTwinAliasItemsBySceneAndElements(
                config,
                sceneId,
                selectedElements
            )?.map((twinAliasItem) => twinAliasItem.alias),
        [config, sceneId, selectedElements]
    );

    useEffect(() => {
        let isValid =
            formData.alias &&
            formData.elementToTwinMappings?.length ===
                selectedElements?.length &&
            !formData.elementToTwinMappings.some((mapping) => !mapping.twinId);

        // Alias name must be unique
        if (
            behaviorTwinAliasFormInfo.mode ===
                TwinAliasFormMode.CreateTwinAlias &&
            existingTwinAliasNames.includes(formData.alias)
        ) {
            isValid = false;
            setErrorMessage(
                t('3dSceneBuilder.twinAlias.errors.twinAliasAlreadyExists')
            );
        }
        // Alias must not start with a number
        else if (/^\d/.test(formData.alias[0])) {
            isValid = false;
            setErrorMessage(
                t('3dSceneBuilder.twinAlias.errors.noNumberPrefix')
            );
        }
        // Alias must be only alphanumeric
        else if (!/^[a-zA-Z0-9]*$/.test(formData.alias)) {
            isValid = false;
            setErrorMessage(
                t('3dSceneBuilder.twinAlias.errors.alphanumericOnly')
            );
        } else {
            setErrorMessage(null);
        }

        setIsFormValid(isValid);
    }, [
        behaviorTwinAliasFormInfo.mode,
        existingTwinAliasNames,
        formData,
        selectedElements,
        t
    ]);

    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0, false);
    const commonPanelStyles = getLeftPanelStyles(theme);

    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonPanelStyles.paddedLeftPanelBlock}>
                    <TextField
                        data-testid={'behavior-alias-twin-name-text-field'}
                        label={t(
                            '3dSceneBuilder.twinAlias.twinAliasForm.aliasNameLabel'
                        )}
                        value={formData.alias}
                        required
                        onChange={(_ev, newVal) =>
                            setFormData(
                                produce((draft) => {
                                    draft.alias = newVal;
                                })
                            )
                        }
                        onRenderLabel={onRenderLabel}
                        disabled={
                            behaviorTwinAliasFormInfo.mode ===
                            TwinAliasFormMode.EditTwinAlias
                        }
                        errorMessage={errorMessage}
                        styles={{
                            root: {
                                '.ms-Label::after': {
                                    paddingRight: 4
                                }
                            }
                        }}
                    />
                </div>
                <div className={styles.elementTwinMappingsSection}>
                    <div className={commonPanelStyles.paddedLeftPanelBlock}>
                        <Label>
                            {t(
                                '3dSceneBuilder.twinAlias.twinAliasForm.mappingSectionHeader'
                            )}
                        </Label>
                        <Text className={commonPanelStyles.text}>
                            {t(
                                '3dSceneBuilder.twinAlias.twinAliasForm.mappingSectionSubHeader'
                            )}
                        </Text>
                    </div>
                    <div className={styles.elementTwinMappingsWrapper}>
                        <div className={commonPanelStyles.paddedLeftPanelBlock}>
                            {!selectedElements ||
                            selectedElements.length === 0 ? (
                                <Text className={commonPanelStyles.text}>
                                    {t(
                                        '3dSceneBuilder.twinAlias.twinAliasForm.elementTwinMappingsNotExist'
                                    )}
                                </Text>
                            ) : (
                                selectedElements?.map((element, idx) => (
                                    <TwinPropertySearchDropdown
                                        key={`aliased-twin-${idx}`}
                                        adapter={adapter}
                                        label={element.displayName}
                                        labelIconName="Shapes"
                                        initialSelectedValue={
                                            element.twinAliases?.[
                                                formData.alias
                                            ]
                                        }
                                        searchPropertyName={DTID_PROPERTY_NAME}
                                        styles={{ root: { paddingBottom: 16 } }}
                                        onChange={(selectedTwinId: string) => {
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
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },
    elementTwinMappingsWrapper: {
        overflowX: 'hidden',
        overflowY: 'auto',
        flexGrow: 1
        // '.cb-search-autocomplete-container': {
        //     position: 'unset !important'
        // }
    },
    errorMessage: {
        color: 'var(--cb-color-text-danger)',
        fontSize: 12,
        marginTop: 2
    }
});

export default BehaviorTwinAliasForm;
