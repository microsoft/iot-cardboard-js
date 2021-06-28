import React, { useState } from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { Stack } from '@fluentui/react/lib/Stack';
import { DTDLComponent } from '../../../Models/Classes/DTDL';

interface CreateComponentFormProps {
    t: (str: string) => string;
    onPrimaryAction: (component: DTDLComponent) => void;
    onCancel: () => void;
    existingModelIds: string[];
    componentToEdit?: DTDLComponent;
}

const CreateComponentForm: React.FC<CreateComponentFormProps> = ({
    t,
    onPrimaryAction,
    onCancel,
    existingModelIds,
    componentToEdit = null
}) => {
    const initialComponent = componentToEdit ?? DTDLComponent.getBlank();
    const [id, setId] = useState(initialComponent['@id']);
    const [name, setName] = useState(initialComponent.name);
    const [displayName, setDisplayName] = useState(initialComponent.displayName);
    const [schema, setSchema] = useState(initialComponent.schema);
    const [comment, setComment] = useState(initialComponent.comment);
    const [description, setDescription] = useState(initialComponent.description);

    const onClickCreate = () => {
        const relationship = new DTDLComponent(
            id, 
            name, 
            schema, 
            comment, 
            description, 
            displayName);
        onPrimaryAction(relationship);
    }

    return <>
        <TextField 
            label={t('modelCreate.componentId')} 
            prefix="dtmi;" 
            suffix=";1"
            placeholder="com:example:component1"
            value={id} 
            onChange={e => setId(e.currentTarget.value)}
            required />
        <TextField label={t('modelCreate.name')} value={name} onChange={e => setName(e.currentTarget.value)} />
        <TextField label={t('modelCreate.displayName')} value={displayName} onChange={e => setDisplayName(e.currentTarget.value)} />
        <Dropdown 
            label={t('modelCreate.schema')} 
            placeholder={t('modelCreate.selectExistingModel')} 
            options={existingModelIds.map(e => { return {key: e, text: e} })}
            onChange={(_e, item) => setSchema(item.key as string)} />
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
        <Stack horizontal>
            <DefaultButton onClick={onCancel}>{t('modelCreate.cancel')}</DefaultButton>
            <PrimaryButton onClick={onClickCreate}>
                {
                    componentToEdit === null 
                        ? t('modelCreate.create')
                        : t('modelCreate.save')
                }
            </PrimaryButton>
        </Stack>
    </>;
}

export default CreateComponentForm;