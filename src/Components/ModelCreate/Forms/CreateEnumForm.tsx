import React, { useState } from 'react';
import { Text, TextField, Dropdown, IDropdownOption } from '@fluentui/react';
import ElementsList from '../ElementsList';
import BaseForm from './BaseForm';
import { DTDLEnum, DTDLEnumValue } from '../../../Models/Classes/DTDL';
import CreateEnumValueForm from './CreateEnumValueForm';
import '../ModelCreate.scss';
import { useTranslation } from 'react-i18next';
import { DTMIRegex, FormMode } from '../../../Models/Constants';

export enum CreateEnumMode {
    EnumForm,
    EnumValueForm
}

class EnumValueToEditInfo {
    enumValue: DTDLEnumValue;
    index: number;

    constructor() {
        this.enumValue = null;
        this.index = -1;
    }
}

interface CreateEnumFormProps {
    onCreateEnum: (dtdlEnum: DTDLEnum) => void;
    onCancel: () => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    enumToEdit?: DTDLEnum;
    formControlMode?: FormMode;
    cancelLabel?: string;
}

const CreateEnumForm: React.FC<CreateEnumFormProps> = ({
    onCreateEnum,
    onCancel,
    pushBreadcrumb,
    popBreadcrumb,
    enumToEdit = null,
    formControlMode = FormMode.Edit,
    cancelLabel
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

    const [enumValueToEdit, setEnumValueToEdit] = useState(
        new EnumValueToEditInfo()
    );

    const onClickCreate = () => {
        const newEnum = new DTDLEnum(
            id,
            enumValues,
            valueSchema.key === 'integer' ? 'integer' : 'string',
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

    const handleSelectEnumValue = (
        enumValue: DTDLEnumValue,
        index: number,
        formControlMode: FormMode = FormMode.Edit
    ) => {
        setMode(CreateEnumMode.EnumValueForm);
        setEnumValueToEdit({ enumValue, index });
        pushBreadcrumb(
            formControlMode === FormMode.Readonly
                ? 'modelCreate.enumValueDetails'
                : 'modelCreate.editEnumValue'
        );
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

    const onCreateEnumValue = (enumValue: DTDLEnumValue) => {
        if (enumValueToEdit.enumValue) {
            setEnumValues((currentEnumValues) => {
                const updatedList = [...currentEnumValues];
                updatedList[enumValueToEdit.index] = enumValue;
                return updatedList;
            });
        } else {
            setEnumValues((currentEnumValues) => {
                return [...currentEnumValues, enumValue];
            });
        }
        backToEnumForm();
    };

    return (
        <>
            {mode === CreateEnumMode.EnumForm && (
                <BaseForm
                    primaryActionLabel={
                        enumToEdit === null ? t('add') : t('update')
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
                        label={t('modelCreate.enumId')}
                        placeholder="<scheme>:<path>;<version>"
                        description={'e.g., dtmi:com:example:enum1;1'}
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
                        label={t('displayName')}
                        title={displayName}
                        value={
                            formControlMode === FormMode.Readonly &&
                            !displayName
                                ? '(' + t('noInformation') + ')'
                                : displayName
                        }
                        className={`${
                            formControlMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formControlMode === FormMode.Readonly &&
                            !displayName
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        onChange={(e) => setDisplayName(e.currentTarget.value)}
                        disabled={formControlMode === FormMode.Readonly}
                    />
                    <TextField
                        label={t('modelCreate.description')}
                        multiline={formControlMode !== FormMode.Readonly}
                        rows={3}
                        title={description}
                        value={
                            formControlMode === FormMode.Readonly &&
                            !description
                                ? '(' + t('noInformation') + ')'
                                : description
                        }
                        className={`${
                            formControlMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formControlMode === FormMode.Readonly &&
                            !description
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
                    <Dropdown
                        label={t('modelCreate.valueSchema')}
                        placeholder={t('selectOption')}
                        options={valueSchemaOptions}
                        selectedKey={valueSchema ? valueSchema.key : undefined}
                        onChange={(_e, item) => setValueSchema(item)}
                        required
                        className={
                            formControlMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        }
                        disabled={formControlMode === FormMode.Readonly}
                    />
                    <Text variant="medium" className="cb-modelcreate-title">
                        {t('modelCreate.enumValues')}
                    </Text>
                    <ElementsList
                        noElementLabelKey="modelCreate.noEnumValues"
                        addElementLabelKey="modelCreate.addEnumValue"
                        elements={enumValues}
                        handleEditElement={handleSelectEnumValue}
                        handleNewElement={onClickAddEnumValue}
                        handleDeleteElement={onClickDeleteEnumValue}
                        formControlMode={formControlMode}
                    />
                </BaseForm>
            )}

            {mode === CreateEnumMode.EnumValueForm && (
                <CreateEnumValueForm
                    onCancel={backToEnumForm}
                    onCreateEnumValue={onCreateEnumValue}
                    valueSchema={valueSchema?.key as string}
                    enumValueToEdit={enumValueToEdit.enumValue}
                    formControlMode={formControlMode}
                    cancelLabel={t('back')}
                />
            )}
        </>
    );
};

export default CreateEnumForm;
