import React, { useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import ElementsList from '../ElementsList';
import { DTDLEnum, DTDLEnumValue } from '../../../Models/Classes/DTDL';
import CreateEnumValueForm from './CreateEnumValueForm';

export enum CreateEnumMode { 
    EnumForm,
    EnumValueForm,
};

interface CreateEnumFormProps {
    t: (str: string) => string;
    onCreateEnum: (dtdlEnum: DTDLEnum) => void;
    onCancel: () => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    enumToEdit?: DTDLEnum;
}

const CreateEnumForm: React.FC<CreateEnumFormProps> = ({ 
    t, 
    onCreateEnum, 
    onCancel,
    pushBreadcrumb,
    popBreadcrumb,
    enumToEdit = null
}) => {
    const [mode, setMode] = useState(CreateEnumMode.EnumForm);

    const valueSchemaOptions: IDropdownOption[] = [
        { key: 'integer', text: 'integer' },
        { key: 'string', text: 'string' },
    ];

    const findSchemaOption = (key: string) => {
        const filtered = valueSchemaOptions.filter(o => o.key === key);
        return filtered[0];
    }

    const initialEnum = enumToEdit ?? DTDLEnum.getBlank();
    const [id, setId] = useState(initialEnum['@id']);
    const [displayName, setDisplayName] = useState(initialEnum.displayName);
    const [description, setDescription] = useState(initialEnum.description);
    const [comment, setComment] = useState(initialEnum.comment);
    const [valueSchema, setValueSchema] = useState<IDropdownOption>(
        findSchemaOption(initialEnum.valueSchema)
    );
    const [enumValues, setEnumValues] = useState<DTDLEnumValue[]>(initialEnum.enumValues);

    const onClickCreate = () => {
        const newEnum = new DTDLEnum(
            id, 
            displayName, 
            description, 
            comment, 
            valueSchema.key as string, 
            enumValues);
        onCreateEnum(newEnum);
    };

    const onClickAddEnumValue = () => {
        setMode(CreateEnumMode.EnumValueForm);
        pushBreadcrumb('modelCreate.addEnumValue');
    }

    // const onClickNewEnumValue = () => {
    //     setMode(CreatePropertyMode.EnumValueForm);
    //     pushBreadcrumb('modelCreate.addEnumValue');
    // }

    // const onClickEditEnumValue = (item: DTDLEnumValue, index: number) => {
    //     onOpenEnumValueForm(item, index);
    // }

    const backToEnumForm = () => {
        setMode(CreateEnumMode.EnumForm)
        popBreadcrumb();
    }

    const onAddEnumValue = (newEnumValue: DTDLEnumValue) => {
        setEnumValues(currentEnumValues => {
            return [
                ...currentEnumValues,
                newEnumValue
            ];
        });
        backToEnumForm();
    };

    const PropertyFormModeFields = () => <>
        <TextField 
            label={t('modelCreate.enumId')}
            prefix="dtmi;" 
            suffix=";1"
            placeholder="com:example:enum1"
            value={id} 
            onChange={e => setId(e.currentTarget.value)} />
        <TextField 
            label={t('modelCreate.displayName')}
            value={displayName} 
            onChange={e => setDisplayName(e.currentTarget.value)} />
        <TextField 
            label={t('modelCreate.description')} 
            multiline
            rows={3} 
            value={description} 
            onChange={e => setDescription(e.currentTarget.value)} />
        <TextField 
            label={t('modelCreate.comment')} 
            multiline
            rows={3} 
            value={comment} 
            onChange={e => setComment(e.currentTarget.value)} />
        <Dropdown 
            label={t('modelCreate.valueSchema')} 
            placeholder={t('modelCreate.selectOption')} 
            options={valueSchemaOptions}
            selectedKey={valueSchema ? valueSchema.key : undefined}
            onChange={(_e, item) => setValueSchema(item)} />
        <ElementsList 
            t={t}
            elementLabelKey="modelCreate.enumValues"
            noElementLabelKey="modelCreate.noEnumValues"
            addElementLabelKey="modelCreate.addEnumValue"
            elements={enumValues}
            handleEditElement={onClickAddEnumValue}
            handleNewElement={onClickAddEnumValue} />
        <Stack horizontal>
            <DefaultButton onClick={onCancel}>{t('modelCreate.cancel')}</DefaultButton>
            <PrimaryButton onClick={() => onClickCreate()}>{t('modelCreate.create')}</PrimaryButton>
        </Stack>
    </>;

    return <>
        {mode === CreateEnumMode.EnumForm && <PropertyFormModeFields />}
        {mode === CreateEnumMode.EnumValueForm 
            && <CreateEnumValueForm 
                t={t}
                onCancel={backToEnumForm}
                onCreateEnumValue={onAddEnumValue} />}
    </>;
};

export default CreateEnumForm;