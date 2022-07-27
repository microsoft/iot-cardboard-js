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
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import TooltipCallout from '../../../../TooltipCallout/TooltipCallout';
import TwinSearchDropdown from '../../../../TwinSearchDropdown/TwinSearchDropdown';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { ElementFormContext } from '../../Elements/ElementForm';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';

const ElementTwinAliasForm: React.FC = () => {
    const { t } = useTranslation();
    const { setElementToEdit } = useContext(ElementFormContext);
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
            setElementToEdit(
                produce((draft) => {
                    draft.twinAliases[formData.alias] = formData.twinId;
                })
            );
        }
        setElementTwinAliasFormInfo(null);
        setFormData(null);
    }, [
        elementTwinAliasFormInfo.mode,
        formData.alias,
        formData.twinId,
        setElementToEdit,
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
                <TwinSearchDropdown
                    key={'aliased-twin'}
                    styles={{ paddingTop: 16 }}
                    adapter={adapter}
                    label={t('twinId')}
                    labelIconName="Shapes"
                    selectedTwinId={formData.twinId}
                    onTwinIdSelect={(selectedTwinId: string) => {
                        handleTwinSelect(selectedTwinId);
                    }}
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
