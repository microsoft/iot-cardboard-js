import React, { useState } from 'react';
import { TextField } from '@fluentui/react';
import { DTDLEnumValue } from '../../../Models/Classes/DTDL';
import BaseForm from './BaseForm';
import { useTranslation } from 'react-i18next';
import { DTDLNameRegex, DTMIRegex, FormMode } from '../../../Models/Constants';

interface CreateEnumValueFormProps {
    onCancel: () => void;
    onCreateEnumValue: (enumValue: DTDLEnumValue) => void;
    valueSchema: string;
    enumValueToEdit?: DTDLEnumValue;
    formControlMode?: FormMode;
    cancelLabel?: string;
}

const CreateEnumValueForm: React.FC<CreateEnumValueFormProps> = ({
    onCancel,
    onCreateEnumValue,
    valueSchema,
    enumValueToEdit = null,
    formControlMode = FormMode.Edit,
    cancelLabel
}) => {
    const { t } = useTranslation();

    const initialEnumValue = enumValueToEdit ?? DTDLEnumValue.getBlank();
    const [id, setId] = useState(initialEnumValue['@id']);
    const [name, setName] = useState(initialEnumValue.name);
    const [displayName, setDisplayName] = useState(
        initialEnumValue.displayName
    );
    const [comment, setComment] = useState(initialEnumValue.comment);
    const [description, setDescription] = useState(
        initialEnumValue.description
    );
    const [enumValue, setEnumValue] = useState(initialEnumValue.enumValue);

    const onClickCreate = () => {
        const newEnumValue = new DTDLEnumValue(
            name,
            valueSchema === 'integer'
                ? Number.parseInt(enumValue as string)
                : enumValue,
            id,
            displayName,
            description,
            comment
        );
        onCreateEnumValue(newEnumValue);
    };

    return (
        <BaseForm
            primaryActionLabel={
                enumValueToEdit === null ? t('add') : t('update')
            }
            cancelLabel={
                cancelLabel
                    ? cancelLabel
                    : formControlMode === FormMode.Readonly
                    ? t('close')
                    : t('cancel')
            }
            onPrimaryAction={onClickCreate}
            onCancel={onCancel}
            formControlMode={formControlMode}
        >
            <TextField
                label={t('modelCreate.enumValueId')}
                title={id}
                value={
                    formControlMode === FormMode.Readonly && !id
                        ? '(' + t('noInformation') + ')'
                        : id
                }
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !id
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                placeholder="<scheme>:<path>;<version>"
                description={'e.g., dtmi:com:example:enumValue1;1'}
                onChange={(e) => setId(e.currentTarget.value)}
                validateOnLoad={false}
                validateOnFocusOut
                onGetErrorMessage={(value) =>
                    value && !DTMIRegex.test(value)
                        ? t('modelCreate.invalidIdentifier', {
                              dtmiLink: 'http://aka.ms/ADTv2Models'
                          })
                        : ''
                }
                disabled={formControlMode === FormMode.Readonly}
            />
            <TextField
                label={t('name')}
                title={name}
                value={
                    formControlMode === FormMode.Readonly && !name
                        ? '(' + t('noInformation') + ')'
                        : name
                }
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !name
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                validateOnLoad={false}
                validateOnFocusOut
                onGetErrorMessage={(value) =>
                    !DTDLNameRegex.test(value)
                        ? t('modelCreate.invalidDTDLName', {
                              dtdlLink: 'http://aka.ms/ADTv2Models'
                          })
                        : ''
                }
                disabled={formControlMode === FormMode.Readonly}
            />
            <TextField
                label={t('modelCreate.enumValue')}
                value={enumValue as string}
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                }`}
                onChange={(e) => setEnumValue(e.currentTarget.value)}
                required
                disabled={formControlMode === FormMode.Readonly}
            />
            <TextField
                label={t('displayName')}
                title={displayName}
                value={
                    formControlMode === FormMode.Readonly && !displayName
                        ? '(' + t('noInformation') + ')'
                        : displayName
                }
                className={
                    formControlMode === FormMode.Readonly && !displayName
                        ? 'cb-noinformation-value'
                        : ''
                }
                onChange={(e) => setDisplayName(e.currentTarget.value)}
                disabled={formControlMode === FormMode.Readonly}
            />
            <TextField
                label={t('modelCreate.description')}
                multiline={formControlMode !== FormMode.Readonly}
                rows={3}
                title={description}
                value={
                    formControlMode === FormMode.Readonly && !description
                        ? '(' + t('noInformation') + ')'
                        : description
                }
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !description
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                onChange={(e) => setDescription(e.currentTarget.value)}
                disabled={formControlMode === FormMode.Readonly}
            />
            <TextField
                label={t('modelCreate.comment')}
                multiline={formControlMode !== FormMode.Readonly}
                rows={3}
                title={comment}
                value={
                    formControlMode === FormMode.Readonly && !comment
                        ? '(' + t('noInformation') + ')'
                        : comment
                }
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !comment
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                onChange={(e) => setComment(e.currentTarget.value)}
                disabled={formControlMode === FormMode.Readonly}
            />
        </BaseForm>
    );
};

export default CreateEnumValueForm;
