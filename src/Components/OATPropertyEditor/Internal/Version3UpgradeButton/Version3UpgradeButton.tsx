import React, { useCallback } from 'react';
import {
    IVersion3UpgradeButtonProps,
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
} from './Version3UpgradeButton.types';
import { getStyles } from './Version3UpgradeButton.styles';
import { classNamesFunction, IconButton, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';

const getClassNames = classNamesFunction<
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
>();

const Version3UpgradeButton: React.FC<IVersion3UpgradeButtonProps> = (
    props
) => {
    const { styles } = props;

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
                message: t(
                    'OAT.PropertyEditor.Version3UpgradeButton.confirmationMessage'
                ),
                title: t(
                    'OAT.PropertyEditor.Version3UpgradeButton.confirmationTitle'
                ),
                primaryButtonText: t(
                    'OAT.PropertyEditor.Version3UpgradeButton.confirmationButtonText'
                ),
                callback: () => {
                    alert('set ');
                }
            }
        });
    }, []);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <IconButton
                iconProps={{
                    iconName: 'UpgradeAnalysis'
                }}
                title={t('OAT.PropertyEditor.Version3UpgradeButton.title')}
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
