import React, { useState } from 'react';
import {
    DefaultButton,
    Dropdown,
    IDropdownOption,
    DropdownMenuItemType,
    TextField,
    Stack,
    Toggle
} from '@fluentui/react';
import {
    DTDLEnum,
    DTDLProperty,
    DTDLSchema,
    DTDLSemanticTypes
} from '../../../Models/Classes/DTDL';
import CreateEnumForm from './CreateEnumForm';
import BaseForm from './BaseForm';
import { useTranslation } from 'react-i18next';
import { DTDLNameRegex, DTMIRegex, FormMode } from '../../../Models/Constants';

export enum CreatePropertyMode {
    PropertyForm,
    EnumForm
}

interface CreatePropertyFormProps {
    onCancel: () => void;
    onPrimaryAction: (property: DTDLProperty) => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    propertyToEdit?: DTDLProperty;
    formControlMode?: FormMode;
    cancelLabel?: string;
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
    onCancel,
    onPrimaryAction,
    pushBreadcrumb,
    popBreadcrumb,
    propertyToEdit = null,
    formControlMode = FormMode.Edit,
    cancelLabel
}) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(CreatePropertyMode.PropertyForm);

    const schemaOptions: IDropdownOption[] = [
        {
            key: 'primitives',
            text: t('modelCreate.primitives'),
            itemType: DropdownMenuItemType.Header
        },
        { key: 'boolean', text: 'boolean' },
        { key: 'date', text: 'date' },
        { key: 'dateTime', text: 'dateTime' },
        { key: 'double', text: 'double' },
        { key: 'duration', text: 'duration' },
        { key: 'float', text: 'float' },
        { key: 'integer', text: 'integer' },
        { key: 'long', text: 'long' },
        { key: 'string', text: 'string' },
        { key: 'time', text: 'time' },
        { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
        {
            key: 'complexSchema',
            text: t('modelCreate.complexSchema'),
            itemType: DropdownMenuItemType.Header
        },
        { key: 'enum', text: 'Enum' },

        // TODO: 'object' and 'map' schema types are not fully supported yet.
        // Update: iremay added data classes for those, should test integration
        { key: 'object', text: 'Object' },
        { key: 'map', text: 'Map' }
    ];

    const parseSchema = (schema: DTDLSchema) => {
        const findDropdownOption = (key: string) => {
            const filtered = schemaOptions.filter(
                (o) => o.key === key.toLowerCase()
            );
            return filtered[0];
        };

        if (typeof schema === 'string') {
            return {
                schema,
                option: findDropdownOption(schema)
            };
        } else if (typeof schema === 'object') {
            return {
                schema,
                option: findDropdownOption(schema['@type'])
            };
        }
    };

    const initialProperty = propertyToEdit ?? DTDLProperty.getBlank();
    const typeInfo = initialProperty['@type'];
    const schemaInfo = parseSchema(initialProperty.schema);
    const [id, setId] = useState(initialProperty['@id']);
    const [name, setName] = useState(initialProperty.name);
    const [displayName, setDisplayName] = useState(initialProperty.displayName);
    const [comment, setComment] = useState(initialProperty.comment);
    const [description, setDescription] = useState(initialProperty.description);
    const [schemaDropdown, setSchemaDropdown] = useState<IDropdownOption>(
        schemaInfo.option
    );
    const [schema, setSchema] = useState<DTDLSchema>(schemaInfo.schema);
    const [unit, setUnit] = useState(initialProperty.unit);
    const [writable, setWritable] = useState(initialProperty.writable);

    const onClickCreate = () => {
        const property = new DTDLProperty(
            name,
            schema,
            id,
            comment,
            description,
            displayName,
            unit,
            writable
        );
        onPrimaryAction(property);
    };

    const onSchemaOptionChange = (option: IDropdownOption) => {
        setSchemaDropdown(option);

        // For complex schema, set the value of the schema as 'null' to make
        // it easier to validate that the user has specified the schema.
        if (['object', 'map', 'enum'].includes(option.key as string)) {
            setSchema(null);
        } else {
            setSchema(option.key as DTDLSchema);
        }
    };

    const handleCreateEnum = (newEnum: DTDLEnum) => {
        setSchema(newEnum);
        backToPropetyFrom();
    };

    const addStep = (mode: CreatePropertyMode, breadcrumbKey: string) => {
        setMode(mode);
        pushBreadcrumb(breadcrumbKey);
    };

    const backToPropetyFrom = () => {
        setMode(CreatePropertyMode.PropertyForm);
        popBreadcrumb();
    };

    return (
        <>
            {mode === CreatePropertyMode.PropertyForm && (
                <BaseForm
                    primaryActionLabel={
                        propertyToEdit === null ? t('add') : t('update')
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
                        label={t('modelCreate.propertyId')}
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
                        description={'e.g., dtmi:com:example:property1;1'}
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
                    <Stack>
                        <Dropdown
                            selectedKey={
                                schemaDropdown ? schemaDropdown.key : undefined
                            }
                            label={t('modelCreate.schema')}
                            placeholder={t('selectOption')}
                            onChange={(_e, option) =>
                                onSchemaOptionChange(option)
                            }
                            options={schemaOptions}
                            required
                            className={`${
                                formControlMode === FormMode.Readonly
                                    ? 'cb-modelcreate-readonly'
                                    : ''
                            }`}
                            disabled={formControlMode === FormMode.Readonly}
                        />
                        {formControlMode !== FormMode.Readonly &&
                            schemaDropdown?.key === 'enum' && (
                                <DefaultButton
                                    onClick={() =>
                                        addStep(
                                            CreatePropertyMode.EnumForm,
                                            'modelCreate.addEnumSchema'
                                        )
                                    }
                                >
                                    {t('modelCreate.addEnumSchema')}
                                </DefaultButton>
                            )}
                    </Stack>
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
                    <TextField
                        label={t('modelCreate.unit')}
                        title={unit}
                        value={
                            formControlMode === FormMode.Readonly && !unit
                                ? DTDLSemanticTypes.map(
                                      (t) => t.SemanticType
                                  ).includes(typeInfo)
                                    ? '(' + t('noInformation') + ')'
                                    : '(' + t('notAvailable') + ')'
                                : unit
                        }
                        className={`${
                            formControlMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formControlMode === FormMode.Readonly && !unit
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        onChange={(e) => setUnit(e.currentTarget.value)}
                        validateOnLoad={false}
                        validateOnFocusOut
                        onGetErrorMessage={(_value) =>
                            unit &&
                            !DTDLSemanticTypes.map(
                                (t) => t.SemanticType
                            ).includes(typeInfo)
                                ? t('modelCreate.invalidTypeForUnitSupport')
                                : ''
                        }
                        disabled={formControlMode === FormMode.Readonly}
                    />
                    <Toggle
                        label={t('modelCreate.writable')}
                        onText={t('modelCreate.true')}
                        offText={t('modelCreate.false')}
                        defaultChecked={writable}
                        onChange={(_e, checked) => setWritable(checked)}
                        disabled={formControlMode === FormMode.Readonly}
                        className={
                            formControlMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        }
                    />
                </BaseForm>
            )}

            {mode === CreatePropertyMode.EnumForm && (
                <CreateEnumForm
                    pushBreadcrumb={pushBreadcrumb}
                    popBreadcrumb={popBreadcrumb}
                    onCreateEnum={handleCreateEnum}
                    onCancel={backToPropetyFrom}
                    cancelLabel={t('back')}
                />
            )}
        </>
    );
};

export default CreatePropertyForm;
