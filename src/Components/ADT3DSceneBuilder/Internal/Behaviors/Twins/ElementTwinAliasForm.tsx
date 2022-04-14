import {
    DefaultButton,
    PrimaryButton,
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
    }, [elementTwinAliasFormInfo, formData]);

    useEffect(() => {
        const isValid = Boolean(formData.alias && formData.twinId);
        setIsFormValid(isValid);
    }, [formData]);

    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0);
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
                        elementTwinAliasFormInfo.mode ===
                        TwinAliasFormMode.EditTwinAlias
                    }
                    description={t(
                        '3dSceneBuilder.twinAlias.descriptions.aliasChangeNotAllowed'
                    )}
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
                    descriptionText={t(
                        '3dSceneBuilder.twinAlias.descriptions.aliasedTwinIdChangeWarning'
                    )}
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
