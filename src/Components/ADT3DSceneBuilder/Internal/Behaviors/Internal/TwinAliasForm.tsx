import {
    DefaultButton,
    PrimaryButton,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    defaultTwinAlias,
    ITwinAliasItem
} from '../../../../../Models/Classes/3DVConfig';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import PanelFooter from '../../Shared/PanelFooter';
import { getPanelFormStyles } from '../../Shared/PanelForms.styles';

// Note, this widget form does not currently support panels
const TwinAliasForm: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, 0);
    const { twinAliasFormInfo, setTwinAliasFormInfo } = useContext(
        SceneBuilderContext
    );

    const [formData, setFormData] = useState<ITwinAliasItem>(
        twinAliasFormInfo.mode === TwinAliasFormMode.CreateTwinAlias
            ? defaultTwinAlias
            : twinAliasFormInfo.twinAlias
    );

    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
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
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    data-testid={'twin-alias-form-primary-button'}
                    text={
                        twinAliasFormInfo.mode ===
                        TwinAliasFormMode.CreateTwinAlias
                            ? t('3dSceneBuilder.createTwinAlias')
                            : t('3dSceneBuilder.updateTwinAlias')
                    }
                    // disabled={!isWidgetConfigValid}
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
