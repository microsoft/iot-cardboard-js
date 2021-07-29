import React, { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DTDLEnumValue } from '../../../Models/Classes/DTDL';
import BaseForm from './BaseForm';
import { useTranslation } from 'react-i18next';
import { DTDLNameRegex, DTMIRegex } from '../../../Models/Constants';

interface CreateEnumValueFormProps {
    onCancel: () => void;
    onCreateEnumValue: (enumValue: DTDLEnumValue) => void;
    enumValueToEdit?: DTDLEnumValue;
}

const CreateEnumValueForm: React.FC<CreateEnumValueFormProps> = ({
    onCancel,
    onCreateEnumValue,
    enumValueToEdit = null
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
            id,
            name,
            enumValue,
            displayName,
            description,
            comment
        );
        onCreateEnumValue(newEnumValue);
    };

    return (
        <BaseForm
            primaryActionLabel={t('add')}
            cancelLabel={t('cancel')}
            onPrimaryAction={onClickCreate}
            onCancel={onCancel}
        >
            <TextField
                label={t('modelCreate.enumValueId')}
                value={id}
                placeholder="<scheme>:<path>;<version>"
                description={'e.g., dtmi:com:example:enumValue1;1'}
                onChange={(e) => setId(e.currentTarget.value)}
                errorMessage={
                    id && !DTMIRegex.test(id)
                        ? t('modelCreate.invalidIdentifier', {
                              dtmiLink: 'http://aka.ms/ADTv2Models'
                          })
                        : ''
                }
            />
            <TextField
                label={t('name')}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                errorMessage={
                    name && !DTDLNameRegex.test(name)
                        ? t('modelCreate.invalidDTDLName', {
                              dtdlLink: 'http://aka.ms/ADTv2Models'
                          })
                        : ''
                }
            />
            <TextField
                label={t('modelCreate.enumValue')}
                value={enumValue as string}
                onChange={(e) => setEnumValue(e.currentTarget.value)}
                required
            />
            <TextField
                label={t('modelCreate.displayName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.currentTarget.value)}
            />
            <TextField
                label={t('modelCreate.description')}
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
            />
            <TextField
                label={t('modelCreate.comment')}
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
            />
        </BaseForm>
    );
};

export default CreateEnumValueForm;
