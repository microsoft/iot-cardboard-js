import React, { useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import BaseForm from './BaseForm';
import { DTDLComponent } from '../../../Models/Classes/DTDL';
import '../ModelCreate.scss';
import { useTranslation } from 'react-i18next';
import { DTDLNameRegex, DTMIRegex } from '../../../Models/Constants';

interface CreateComponentFormProps {
    onPrimaryAction: (component: DTDLComponent) => void;
    onCancel: () => void;
    existingModelIds: string[];
    componentToEdit?: DTDLComponent;
}

const CreateComponentForm: React.FC<CreateComponentFormProps> = ({
    onPrimaryAction,
    onCancel,
    existingModelIds,
    componentToEdit = null
}) => {
    const { t } = useTranslation();

    const initialComponent = componentToEdit ?? DTDLComponent.getBlank();
    const [id, setId] = useState(initialComponent['@id']);
    const [name, setName] = useState(initialComponent.name);
    const [displayName, setDisplayName] = useState(
        initialComponent.displayName
    );
    const [schema, setSchema] = useState(initialComponent.schema);
    const [comment, setComment] = useState(initialComponent.comment);
    const [description, setDescription] = useState(
        initialComponent.description
    );

    const onClickCreate = () => {
        const relationship = new DTDLComponent(
            id,
            name,
            schema,
            comment,
            description,
            displayName
        );
        onPrimaryAction(relationship);
    };

    return (
        <BaseForm
            primaryActionLabel={
                componentToEdit === null ? t('add') : t('update')
            }
            cancelLabel={t('cancel')}
            onPrimaryAction={onClickCreate}
            onCancel={onCancel}
        >
            <TextField
                label={t('modelCreate.componentId')}
                placeholder="<scheme>:<path>;<version>"
                description={'e.g., dtmi:com:example:component1;1'}
                value={id}
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
                label={t('modelCreate.displayName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.currentTarget.value)}
            />
            <Dropdown
                label={t('modelCreate.schema')}
                placeholder={t('modelCreate.selectExistingModel')}
                selectedKey={schema ? schema : undefined}
                options={existingModelIds.map((e) => {
                    return { key: e, text: e };
                })}
                onChange={(_e, item) => setSchema(item.key as string)}
                required
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

export default CreateComponentForm;
