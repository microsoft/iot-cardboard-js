import {
    DefaultButton,
    ITextFieldProps,
    PrimaryButton,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultElementTwinAlias,
    IElementTwinAliasItem
} from '../../../../../Models/Classes/3DVConfig';
import {
    DTID_PROPERTY_NAME,
    TwinAliasFormMode
} from '../../../../../Models/Constants';
import { useElementFormContext } from '../../../../../Models/Context/ElementsFormContext/ElementFormContext';
import { ElementFormContextActionType } from '../../../../../Models/Context/ElementsFormContext/ElementFormContext.types';
import TooltipCallout from '../../../../TooltipCallout/TooltipCallout';
import TwinPropertySearchDropdown from '../../../../TwinSearchPropertyDropdown/TwinSearchDropdown';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';

const ElementTwinAliasForm: React.FC = () => {
    const { t } = useTranslation();
    const { elementFormDispatch } = useElementFormContext();
    const {
        adapter,
        elementTwinAliasFormInfo,
        setElementTwinAliasFormInfo
    } = useContext(SceneBuilderContext);

    const [formData, setFormData] = useState<IElementTwinAliasItem>(
        elementTwinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
            ? defaultElementTwinAlias
            : elementTwinAliasFormInfo.twinAlias
    );
    const [isFormValid, setIsFormValid] = useState(false);

    const handleTwinSelect = useCallback(
        (twinId: string) => {
            setFormData(
                produce((draft) => {
                    draft.twinId = twinId;
                })
            );
        },
        [setFormData]
    );

    const onSaveTwinAliasForm = useCallback(() => {
        if (elementTwinAliasFormInfo.mode === TwinAliasFormMode.EditTwinAlias) {
            elementFormDispatch({
                type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                payload: {
                    aliasName: formData.alias,
                    aliasTarget: formData.twinId
                }
            });
        }
        setElementTwinAliasFormInfo(null);
        setFormData(null);
    }, [
        elementFormDispatch,
        elementTwinAliasFormInfo.mode,
        formData.alias,
        formData.twinId,
        setElementTwinAliasFormInfo
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

    useEffect(() => {
        const isValid = Boolean(formData.alias && formData.twinId);
        setIsFormValid(isValid);
    }, [formData]);

    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0, true);
    return (
        <>
            <div className={commonFormStyles.content}>
                <TextField
                    label={t(
                        '3dSceneBuilder.twinAlias.twinAliasForm.aliasNameLabel'
                    )}
                    onRenderLabel={onRenderLabel}
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
                        elementTwinAliasFormInfo.mode ===
                        TwinAliasFormMode.EditTwinAlias
                    }
                    styles={{
                        root: {
                            '.ms-Label::after': {
                                paddingRight: 4
                            }
                        }
                    }}
                />
                <TwinPropertySearchDropdown
                    key={'aliased-twin'}
                    adapter={adapter}
                    label={t('twinId')}
                    labelIconName="Shapes"
                    onChange={(selectedTwinId: string) => {
                        handleTwinSelect(selectedTwinId);
                    }}
                    initialSelectedValue={formData.twinId}
                    searchPropertyName={DTID_PROPERTY_NAME}
                    styles={{ root: { paddingTop: 16 } }}
                />
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'twin-alias-form-primary-button'}
                    onClick={onSaveTwinAliasForm}
                    text={
                        elementTwinAliasFormInfo.mode ===
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
                        setElementTwinAliasFormInfo(null);
                        setFormData(null);
                    }}
                />
            </PanelFooter>
        </>
    );
};

export default ElementTwinAliasForm;
