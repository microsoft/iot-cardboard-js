import React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import '../ModelCreate.scss';
import { FormMode } from '../../../Models/Constants';

interface BaseFormProps {
    primaryActionLabel: string;
    cancelLabel: string;
    onPrimaryAction: (element: any) => void;
    onCancel: () => void;
    formControlMode?: FormMode;
    isActionButtonsVisible?: boolean;
}

const BaseForm: React.FC<BaseFormProps> = ({
    primaryActionLabel,
    cancelLabel,
    onPrimaryAction,
    onCancel,
    formControlMode,
    isActionButtonsVisible = true,
    children
}) => (
    <div className="cb-form-container">
        <div className="cb-form-main">{children}</div>
        {isActionButtonsVisible && (
            <div className="cb-form-footer">
                <DefaultButton onClick={onCancel}>{cancelLabel}</DefaultButton>
                {formControlMode !== FormMode.Readonly && (
                    <PrimaryButton onClick={onPrimaryAction}>
                        {primaryActionLabel}
                    </PrimaryButton>
                )}
            </div>
        )}
    </div>
);

export default BaseForm;
