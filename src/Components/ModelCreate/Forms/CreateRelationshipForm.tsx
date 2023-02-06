import React, { useState } from 'react';
import {
    Dropdown,
    IDropdownOption,
    SpinButton,
    Toggle,
    TextField,
    Separator
} from '@fluentui/react';
import { DTDLProperty, DTDLRelationship } from '../../../Models/Classes/DTDL';
import CreatePropertyForm from './CreatePropertyForm';
import ElementsList from '../ElementsList';
import BaseForm from './BaseForm';
import { DTDLNameRegex, DTMIRegex, FormMode } from '../../../Models/Constants';
import { useTranslation } from 'react-i18next';

export enum CreateRelationshipMode {
    RelationshipForm,
    PropertyForm
}

interface CreateRelationshipFromProps {
    onPrimaryAction: (relationship: DTDLRelationship) => void;
    onCancel: () => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    existingModelIds: string[];
    relationshipToEdit?: DTDLRelationship;
    formControlMode?: FormMode;
}

class PropertyToEditInfo {
    property: DTDLProperty;
    index: number;

    constructor() {
        this.property = null;
        this.index = -1;
    }
}

const CreateRelationshipForm: React.FC<CreateRelationshipFromProps> = ({
    onPrimaryAction,
    onCancel,
    pushBreadcrumb,
    popBreadcrumb,
    existingModelIds,
    relationshipToEdit = null,
    formControlMode = FormMode.Edit
}) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(CreateRelationshipMode.RelationshipForm);
    const [formMode, setFormMode] = useState(
        formControlMode
            ? formControlMode
            : relationshipToEdit
            ? FormMode.Edit
            : FormMode.New
    );

    const schemaOptions: IDropdownOption[] = [
        { key: 'any', text: t('modelCreate.anyInterface') }
    ];

    existingModelIds.forEach((modelId) => {
        schemaOptions.push({ key: modelId, text: modelId });
    });

    const parseTarget = (targetKey: string) => {
        if (!targetKey) {
            return undefined;
        }

        const filtered = schemaOptions.filter((o) => o.key === targetKey);
        return filtered[0];
    };

    const initialRelationship =
        relationshipToEdit ?? DTDLRelationship.getBlank();
    const [id, setId] = useState(initialRelationship['@id']);
    const [name, setName] = useState(initialRelationship.name);
    const [displayName, setDisplayName] = useState(
        initialRelationship.displayName
    );
    const [description, setDescription] = useState(
        initialRelationship.description
    );
    const [comment, setComment] = useState(initialRelationship.comment);
    const [maxMultiplicity, setMaxMultiplicity] = useState(
        initialRelationship.maxMultiplicity?.toString()
    );
    const [target, setTarget] = useState<IDropdownOption>(
        parseTarget(initialRelationship.target)
    );
    const [writable, setWritable] = useState(initialRelationship.writable);
    const [properties, setProperties] = useState(
        initialRelationship.properties
    );
    const [propertyToEdit, setPropertyToEdit] = useState(
        new PropertyToEditInfo()
    );

    const onClickCreate = () => {
        const relationship = new DTDLRelationship(
            name,
            id,
            displayName,
            description,
            comment,
            writable,
            properties,
            !target || target.key === 'any' ? null : (target.key as string),
            maxMultiplicity === undefined ? null : Number(maxMultiplicity)
        );
        onPrimaryAction(relationship);
    };

    const handleClickAddProperty = () => {
        setFormMode(FormMode.New);
        setMode(CreateRelationshipMode.PropertyForm);
        setPropertyToEdit(new PropertyToEditInfo());
        pushBreadcrumb('modelCreate.addProperty');
    };

    const handlePropertyFormAction = (property: DTDLProperty) => {
        if (propertyToEdit?.property) {
            setProperties((currentProperties) => {
                const updatedList = [...currentProperties];
                updatedList[propertyToEdit.index] = property;
                return updatedList;
            });
        } else {
            setProperties((currentProperties) => {
                return [...currentProperties, property];
            });
        }
        backToRelationshipForm();
    };

    const handleSelectProperty = (
        property: DTDLProperty,
        index: number,
        formControlMode: FormMode = FormMode.Edit
    ) => {
        setFormMode(formControlMode);
        setMode(CreateRelationshipMode.PropertyForm);
        setPropertyToEdit({ property, index });
        pushBreadcrumb(
            formControlMode === FormMode.Readonly
                ? 'modelCreate.propertyDetails'
                : 'modelCreate.editProperty'
        );
    };

    const handleDeleteProperty = (index: number) => {
        setProperties((curretnProperties) => {
            const copy = [...curretnProperties];
            copy.splice(index, 1);
            return copy;
        });
    };

    const backToRelationshipForm = () => {
        setMode(CreateRelationshipMode.RelationshipForm);
        popBreadcrumb();
    };

    return (
        <>
            {mode === CreateRelationshipMode.RelationshipForm && (
                <BaseForm
                    primaryActionLabel={
                        relationshipToEdit === null ? t('add') : t('update')
                    }
                    cancelLabel={
                        formMode === FormMode.Readonly
                            ? t('close')
                            : t('cancel')
                    }
                    onPrimaryAction={onClickCreate}
                    onCancel={onCancel}
                    formControlMode={formMode}
                >
                    <TextField
                        label={t('modelCreate.relationshipId')}
                        title={id}
                        value={
                            formMode === FormMode.Readonly && !id
                                ? '(' + t('noInformation') + ')'
                                : id
                        }
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !id
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        placeholder="<scheme>:<path>;<version>"
                        description="e.g., dtmi:com:example:relationship1;1"
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
                        disabled={formMode === FormMode.Readonly}
                    />
                    <TextField
                        label={t('name')}
                        title={name}
                        value={
                            formMode === FormMode.Readonly && !name
                                ? '(' + t('noInformation') + ')'
                                : name
                        }
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !name
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
                        disabled={formMode === FormMode.Readonly}
                    />
                    <TextField
                        label={t('displayName')}
                        title={displayName}
                        value={
                            formMode === FormMode.Readonly && !displayName
                                ? '(' + t('noInformation') + ')'
                                : displayName
                        }
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !displayName
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        onChange={(e) => setDisplayName(e.currentTarget.value)}
                        disabled={formMode === FormMode.Readonly}
                    />
                    <TextField
                        label={t('modelCreate.description')}
                        multiline={formMode !== FormMode.Readonly}
                        rows={3}
                        title={description}
                        value={
                            formMode === FormMode.Readonly && !description
                                ? '(' + t('noInformation') + ')'
                                : description
                        }
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !description
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        onChange={(e) => setDescription(e.currentTarget.value)}
                        disabled={formMode === FormMode.Readonly}
                    />
                    <TextField
                        label={t('modelCreate.comment')}
                        multiline={formMode !== FormMode.Readonly}
                        rows={3}
                        title={comment}
                        value={
                            formMode === FormMode.Readonly && !comment
                                ? '(' + t('noInformation') + ')'
                                : comment
                        }
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !comment
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        onChange={(e) => setComment(e.currentTarget.value)}
                        disabled={formMode === FormMode.Readonly}
                    />
                    <SpinButton
                        styles={{ root: { padding: '20px 0 8px' } }}
                        label={t('modelCreate.maxMultiplicity')}
                        min={0}
                        step={1}
                        value={maxMultiplicity}
                        onChange={(_e, newValue) =>
                            setMaxMultiplicity(
                                newValue === undefined ? '0' : newValue
                            )
                        }
                        incrementButtonAriaLabel={t('modelCreate.increaseBy1')}
                        decrementButtonAriaLabel={t('modelCreate.decreaseBy1')}
                        className={
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        }
                        disabled={formMode === FormMode.Readonly}
                    />
                    <Dropdown
                        label={t('modelCreate.targetModel')}
                        placeholder={
                            formMode === FormMode.Readonly && !target
                                ? '(' + t('noInformation') + ')'
                                : t('selectOption')
                        }
                        selectedKey={target ? target.key : undefined}
                        onChange={(_e, item) => setTarget(item)}
                        options={schemaOptions}
                        className={`${
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        } ${
                            formMode === FormMode.Readonly && !target
                                ? 'cb-noinformation-value'
                                : ''
                        }`}
                        disabled={formMode === FormMode.Readonly}
                    />
                    <Toggle
                        label={t('modelCreate.writable')}
                        onText={t('modelCreate.true')}
                        offText={t('modelCreate.false')}
                        defaultChecked={writable}
                        onChange={(_e, checked) => setWritable(checked)}
                        className={
                            formMode === FormMode.Readonly
                                ? 'cb-modelcreate-readonly'
                                : ''
                        }
                        disabled={formMode === FormMode.Readonly}
                    />
                    <Separator>{t('modelCreate.properties')}</Separator>
                    <ElementsList
                        noElementLabelKey="modelCreate.noProperties"
                        addElementLabelKey="modelCreate.addProperty"
                        elements={properties}
                        handleEditElement={handleSelectProperty}
                        handleNewElement={handleClickAddProperty}
                        handleDeleteElement={handleDeleteProperty}
                        formControlMode={formMode}
                    />
                </BaseForm>
            )}

            {mode === CreateRelationshipMode.PropertyForm && (
                <CreatePropertyForm
                    onCancel={backToRelationshipForm}
                    onPrimaryAction={handlePropertyFormAction}
                    pushBreadcrumb={pushBreadcrumb}
                    popBreadcrumb={popBreadcrumb}
                    propertyToEdit={propertyToEdit.property}
                    formControlMode={formMode}
                    cancelLabel={t('back')}
                />
            )}
        </>
    );
};

export default CreateRelationshipForm;
