import React, { useState } from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import ElementsList from '../ElementsList';
import BaseForm from './BaseForm';
import { DTDLEnum, DTDLEnumValue } from '../../../Models/Classes/DTDL';
import CreateEnumValueForm from './CreateEnumValueForm';
import '../ModelCreate.scss';
import { useTranslation } from 'react-i18next';
import { DTMIRegex } from '../../../Models/Constants';

export enum CreateEnumMode {
    EnumForm,
    EnumValueForm
}

interface CreateEnumFormProps {
    onCreateEnum: (dtdlEnum: DTDLEnum) => void;
    onCancel: () => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    enumToEdit?: DTDLEnum;
}

const CreateEnumForm: React.FC<CreateEnumFormProps> = ({
    onCreateEnum,
    onCancel,
    pushBreadcrumb,
    popBreadcrumb,
    enumToEdit = null
}) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(CreateEnumMode.EnumForm);

    const valueSchemaOptions: IDropdownOption[] = [
        { key: 'integer', text: 'integer' },
        { key: 'string', text: 'string' }
    ];

    const findSchemaOption = (key: string) => {
        const filtered = valueSchemaOptions.filter((o) => o.key === key);
        return filtered[0];
    };

    const initialEnum = enumToEdit ?? DTDLEnum.getBlank();
    const [id, setId] = useState(initialEnum['@id']);
    const [displayName, setDisplayName] = useState(initialEnum.displayName);
    const [description, setDescription] = useState(initialEnum.description);
    const [comment, setComment] = useState(initialEnum.comment);
    const [valueSchema, setValueSchema] = useState<IDropdownOption>(
        findSchemaOption(initialEnum.valueSchema)
    );
    const [enumValues, setEnumValues] = useState<DTDLEnumValue[]>(
        initialEnum.enumValues
    );

    const onClickCreate = () => {
        const newEnum = new DTDLEnum(
            id,
            enumValues,
            valueSchema.key as string,
            displayName,
            description,
            comment
        );
        onCreateEnum(newEnum);
    };

    const onClickAddEnumValue = () => {
        setMode(CreateEnumMode.EnumValueForm);
        pushBreadcrumb('modelCreate.addEnumValue');
    };

    const onClickDeleteEnumValue = (index: number) => {
        setEnumValues((currentEnumValues) => {
            const copy = [...currentEnumValues];
            copy.splice(index, 1);
            return copy;
        });
    };

    const backToEnumForm = () => {
        setMode(CreateEnumMode.EnumForm);
        popBreadcrumb();
    };

    const onAddEnumValue = (newEnumValue: DTDLEnumValue) => {
        setEnumValues((currentEnumValues) => {
            return [...currentEnumValues, newEnumValue];
        });
        backToEnumForm();
    };

    return (
        <>
            {mode === CreateEnumMode.EnumForm && (
                <BaseForm
                    primaryActionLabel={
                        enumToEdit === null ? t('add') : t('update')
                    }
                    cancelLabel={t('cancel')}
                    onPrimaryAction={onClickCreate}
                    onCancel={onCancel}
                >
                    <TextField
                        label={t('modelCreate.enumId')}
                        placeholder="<scheme>:<path>;<version>"
                        description={'e.g., dtmi:com:example:enum1;1'}
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
                    <Dropdown
                        label={t('modelCreate.valueSchema')}
                        placeholder={t('modelCreate.selectOption')}
                        options={valueSchemaOptions}
                        selectedKey={valueSchema ? valueSchema.key : undefined}
                        onChange={(_e, item) => setValueSchema(item)}
                        required
                    />
                    <Text variant="medium" className="cb-modelcreate-title">
                        {t('modelCreate.enumValues')}
                    </Text>
                    <ElementsList
                        noElementLabelKey="modelCreate.noEnumValues"
                        addElementLabelKey="modelCreate.addEnumValue"
                        elements={enumValues}
                        handleEditElement={onClickAddEnumValue}
                        handleNewElement={onClickAddEnumValue}
                        handleDeleteElement={onClickDeleteEnumValue}
                    />
                </BaseForm>
            )}

            {mode === CreateEnumMode.EnumValueForm && (
                <CreateEnumValueForm
                    onCancel={backToEnumForm}
                    onCreateEnumValue={onAddEnumValue}
                />
            )}
        </>
    );
};

export default CreateEnumForm;
