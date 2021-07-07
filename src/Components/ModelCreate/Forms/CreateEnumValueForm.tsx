import React, { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DTDLEnumValue } from '../../../Models/Classes/DTDL';
import BaseForm from './BaseForm';

interface CreateEnumValueFormProps {
    t: (str: string) => string;
    onCancel: () => void;
    onCreateEnumValue: (enumValue: DTDLEnumValue) => void;
    enumValueToEdit?: DTDLEnumValue;
}

const CreateEnumValueForm: React.FC<CreateEnumValueFormProps> = ({ 
    t, 
    onCancel, 
    onCreateEnumValue,
    enumValueToEdit = null
}) => {
    const initialEnumValue = enumValueToEdit ?? DTDLEnumValue.getBlank();
    const [id, setId] = useState(initialEnumValue['@id']);
    const [name, setName] = useState(initialEnumValue.name);
    const [displayName, setDisplayName] = useState(initialEnumValue.displayName);
    const [comment, setComment] = useState(initialEnumValue.comment);
    const [description, setDescription] = useState(initialEnumValue.description);
    const [enumValue, setEnumValue] = useState(initialEnumValue.enumValue);

    const onClickCreate = () => {
        const newEnumValue = new DTDLEnumValue(id, name, displayName, description, comment, enumValue);
        onCreateEnumValue(newEnumValue);
    };

    return <BaseForm
        primaryActionLabel={t('modelCreate.add')}
        cancelLabel={t('modelCreate.cancel')}
        onPrimaryAction={onClickCreate}
        onCancel={onCancel} >
        <TextField 
            label={t('modelCreate.propertyId')} 
            prefix="dtmi;" 
            suffix=";1"
            value={id} 
            placeholder="com:example:property1"
            onChange={e => setId(e.currentTarget.value)}
            required />
        <TextField label={t('modelCreate.name')} value={name} onChange={e => setName(e.currentTarget.value)} />
        <TextField label={t('modelCreate.displayName')} value={displayName} onChange={e => setDisplayName(e.currentTarget.value)} />
        <TextField 
            label={t('modelCreate.comment')} 
            multiline 
            rows={3} 
            value={comment} 
            onChange={e => setComment(e.currentTarget.value)} />
        <TextField 
            label={t('modelCreate.description')} 
            multiline 
            rows={3} 
            value={description} 
            onChange={e => setDescription(e.currentTarget.value)} />
        <TextField label={t('modelCreate.enumValue')} value={enumValue as string} onChange={e => setEnumValue(e.currentTarget.value)} />
    </BaseForm>;
};

export default CreateEnumValueForm;