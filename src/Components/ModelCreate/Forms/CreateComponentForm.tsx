import React, { useState } from 'react';
import { Dropdown, TextField } from '@fluentui/react';
import BaseForm from './BaseForm';
import { DTDLComponent } from '../../../Models/Classes/DTDL';
import '../ModelCreate.scss';
import { useTranslation } from 'react-i18next';
import { DTDLNameRegex, DTMIRegex, FormMode } from '../../../Models/Constants';

interface CreateComponentFormProps {
    onPrimaryAction: (component: DTDLComponent) => void;
    onCancel: () => void;
    existingModelIds: string[];
    componentToEdit?: DTDLComponent;
    formControlMode?: FormMode;
}

const CreateComponentForm: React.FC<CreateComponentFormProps> = ({
    onPrimaryAction,
    onCancel,
    existingModelIds,
    componentToEdit = null,
    formControlMode = FormMode.Edit
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
        const component = new DTDLComponent(
            name,
            schema,
            id,
            comment,
            description,
            displayName
        );
        onPrimaryAction(component);
    };

    return (
        <BaseForm
            primaryActionLabel={
                componentToEdit === null ? t('add') : t('update')
            }
            cancelLabel={
                formControlMode === FormMode.Readonly ? t('close') : t('cancel')
            }
            onPrimaryAction={onClickCreate}
            onCancel={onCancel}
            formControlMode={formControlMode}
        >
            <TextField
                label={t('modelCreate.componentId')}
                placeholder="<scheme>:<path>;<version>"
                description={'e.g., dtmi:com:example:component1;1'}
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
                value={name}
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
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !name
                        ? 'cb-noinformation-value'
                        : ''
                }`}
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
                className={`${
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                } ${
                    formControlMode === FormMode.Readonly && !displayName
                        ? 'cb-noinformation-value'
                        : ''
                }`}
                onChange={(e) => setDisplayName(e.currentTarget.value)}
                disabled={formControlMode === FormMode.Readonly}
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
                className={
                    formControlMode === FormMode.Readonly
                        ? 'cb-modelcreate-readonly'
                        : ''
                }
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

export default CreateComponentForm;
