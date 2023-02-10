import React, { useCallback } from 'react';
import {
    IVersion3UpgradeButtonProps,
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
} from './Version3UpgradeButton.types';
import { getStyles } from './Version3UpgradeButton.styles';
import { ActionButton, classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import { updateDtdlVersion } from '../../../../Models/Services/DtdlUtils';
import { DTDL_CONTEXT_VERSION_3 } from '../../../../Models/Classes/DTDL';

const getClassNames = classNamesFunction<
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
>();

const LOC_KEYS = {
    dialogMessage:
        'OAT.PropertyEditor.Version3UpgradeButton.confirmationMessage',
    dialogTitle: 'OAT.PropertyEditor.Version3UpgradeButton.confirmationTitle',
    dialogButtonText:
        'OAT.PropertyEditor.Version3UpgradeButton.confirmationButtonText',
    buttonTitle: 'OAT.PropertyEditor.Version3UpgradeButton.buttonTitle',
    buttonText: 'OAT.PropertyEditor.Version3UpgradeButton.buttonText'
};

const Version3UpgradeButton: React.FC<IVersion3UpgradeButtonProps> = (
    props
) => {
    const { selectedModel, styles } = props;

    // contexts
    const { oatPageDispatch } = useOatPageContext();

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onClickUpgrade = useCallback(() => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
            payload: {
                open: true,
                message: t(LOC_KEYS.dialogMessage),
                title: t(LOC_KEYS.dialogTitle),
                primaryButtonText: t(LOC_KEYS.dialogButtonText),
                callback: () => {
                    const updatedModel = updateDtdlVersion(
                        selectedModel,
                        DTDL_CONTEXT_VERSION_3
                    );
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_MODEL,
                        payload: {
                            model: updatedModel
                        }
                    });
                }
            }
        });
    }, [oatPageDispatch, selectedModel, t]);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <ActionButton
                iconProps={{
                    iconName: 'UpgradeAnalysis'
                }}
                text={t(LOC_KEYS.buttonText)}
                title={t(LOC_KEYS.buttonTitle)}
                onClick={onClickUpgrade}
            />
        </div>
    );
};

export default styled<
    IVersion3UpgradeButtonProps,
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
>(Version3UpgradeButton, getStyles);
