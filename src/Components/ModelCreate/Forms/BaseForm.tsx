import React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import '../ModelCreate.scss';
import { FormMode } from '../../../Models/Constants';

interface BaseFormProps {
    primaryActionLabel: string;
    cancelLabel: string;
    onPrimaryAction: (element: any) => void;
    onCancel: () => void;
    formControlMode?: FormMode;
}

const BaseForm: React.FC<BaseFormProps> = ({
    primaryActionLabel,
    cancelLabel,
    onPrimaryAction,
    onCancel,
    formControlMode,
    children
}) => (
    <div className="cb-form-container">
        <div className="cb-form-main">{children}</div>
        {formControlMode !== FormMode.View && (
            <div className="cb-form-footer">
                <DefaultButton onClick={onCancel}>{cancelLabel}</DefaultButton>
                <PrimaryButton onClick={onPrimaryAction}>
                    {primaryActionLabel}
                </PrimaryButton>
            </div>
        )}
    </div>
);

export default BaseForm;
