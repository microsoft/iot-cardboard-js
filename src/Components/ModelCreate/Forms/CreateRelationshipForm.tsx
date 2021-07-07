import React, { useState } from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { SpinButton } from '@fluentui/react/lib/SpinButton';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { TextField } from '@fluentui/react/lib/TextField';
import { Separator } from '@fluentui/react/lib/Separator';
import { DTDLProperty, DTDLRelationship } from '../../../Models/Classes/DTDL';
import CreatePropertyForm from './CreatePropertyForm';
import ElementsList from '../ElementsList';
import BaseForm from './BaseForm';
import { AuthoringMode } from '../../../Models/Constants';

export enum CreateRelationshipMode { 
    RelationshipForm,
    PropertyForm, 
};

interface CreateRelationshipFromProps {
    t: (str: string) => string;
    onPrimaryAction: (relationship: DTDLRelationship) => void;
    onCancel: () => void;
    pushBreadcrumb: (breadcrumbKey: string) => void;
    popBreadcrumb: () => void;
    existingModelIds: string[];
    relationshipToEdit?: DTDLRelationship;
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
    t, 
    onPrimaryAction, 
    onCancel, 
    pushBreadcrumb,
    popBreadcrumb,
    existingModelIds,
    relationshipToEdit = null
}) => {
    const [mode, setMode] = useState(CreateRelationshipMode.RelationshipForm);
    const [authoringMode, setAuthoringMode] = useState(AuthoringMode.Add);

    const schemaOptions: IDropdownOption[] = [
        { key: 'any', text: t('modelCreate.anyInterface') },
    ];

    existingModelIds.forEach(modelId => {
        schemaOptions.push({ key: modelId, text: modelId });
    });

    const parseTarget = (targetKey: string) => {
        if(!targetKey) {
            return undefined;
        }

        const filtered = schemaOptions.filter(o => o.key === targetKey.toLowerCase());
        return filtered[0];
    }

    const initialRelationship = relationshipToEdit ?? DTDLRelationship.getBlank();
    const [id, setId] = useState(initialRelationship['@id']);
    const [name, setName] = useState(initialRelationship.name);
    const [displayName, setDisplayName] = useState(initialRelationship.displayName);
    const [description, setDescription] = useState(initialRelationship.description);
    const [comment, setComment] = useState(initialRelationship.comment);
    const [maxMultiplicity, setMaxMultiplicity] = useState(initialRelationship.maxMultiplicity?.toString());
    const [target, setTarget] = useState<IDropdownOption>(parseTarget(initialRelationship.target));
    const [writable, setWritable] = useState(initialRelationship.writable);
    const [properties, setProperties] = useState(initialRelationship.properties);
    const [propertyToEdit, setPropertyToEdit] = useState(new PropertyToEditInfo());

    const onClickCreate = () => {
        const relationship = new DTDLRelationship(
            id,
            name, 
            displayName, 
            description, 
            comment,
            writable,
            properties,
            !target || target.key === 'any' ? null : target.key as string,
            maxMultiplicity === undefined ? null : Number(maxMultiplicity));
        onPrimaryAction(relationship);
    }

    const handleClickAddProperty = () => {
        setAuthoringMode(AuthoringMode.Add);
        setMode(CreateRelationshipMode.PropertyForm);
        setPropertyToEdit(new PropertyToEditInfo());
        pushBreadcrumb('modelCreate.addProperty');
    }

    const handlePropertyFormAction = (property: DTDLProperty) => {
        if(authoringMode === AuthoringMode.Add) {
            setProperties(currentProperties => {
                return [
                    ...currentProperties,
                    property
                ];
            });
        } else {
            setProperties(currentProperties => {
                const updatedList = [...currentProperties];
                updatedList[propertyToEdit.index] = property;
                return updatedList;
            });
        }
        backToRelationshipForm();
    };

    const handleSelectProperty = (property: DTDLProperty, index: number) => {
        setAuthoringMode(AuthoringMode.Edit);
        setMode(CreateRelationshipMode.PropertyForm);
        setPropertyToEdit({ property, index });
        pushBreadcrumb('modelCreate.editProperty');
    };

    const handleDeleteProperty = (index: number) => {
        setProperties(curretnProperties => {
            const copy = [...curretnProperties];
            copy.splice(index, 1);
            return copy;
        });
    };

    const backToRelationshipForm = () => {
        setMode(CreateRelationshipMode.RelationshipForm);
        popBreadcrumb();
    };

    return <>
        {mode === CreateRelationshipMode.RelationshipForm && 
            <BaseForm
                primaryActionLabel={
                    relationshipToEdit === null 
                        ? t('modelCreate.add')
                        : t('modelCreate.update')
                }
                cancelLabel={t('modelCreate.cancel')}
                onPrimaryAction={onClickCreate}
                onCancel={onCancel}>
                <TextField
                    label={t('modelCreate.relationshipId')}
                    prefix="dtmi;"
                    suffix=";1"
                    value={id}
                    placeholder="com:example:relationship1"
                    onChange={e => setId(e.currentTarget.value)}
                    required />
                <TextField
                    label={t('modelCreate.name')}
                    value={name}
                    onChange={e => setName(e.currentTarget.value)} 
                    required />
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
                <SpinButton
                    label={t('modelCreate.maxMultiplicity')}
                    min={0}
                    step={1}
                    value={maxMultiplicity}
                    onChange={(_e, newValue) => setMaxMultiplicity(newValue === undefined ? '0' : newValue)}
                    incrementButtonAriaLabel={t('modelCreate.increaseBy1')}
                    decrementButtonAriaLabel={t('modelCreate.decreaseBy1')} />
                <Dropdown 
                    label={t('modelCreate.targetModel')} 
                    placeholder={t('modelCreate.selectOption')} 
                    selectedKey={target ? target.key : undefined}
                    onChange={(_e, item) => setTarget(item)}
                    options={schemaOptions} />
                <Toggle 
                    label={t('modelCreate.writable')} 
                    onText={t('modelCreate.true')} 
                    offText={t('modelCreate.false')} 
                    defaultChecked={writable}
                    onChange={(_e, checked) => setWritable(checked)} />
                <Separator>{t('modelCreate.properties')}</Separator>
                <ElementsList 
                    t={t}
                    noElementLabelKey="modelCreate.noProperties"
                    addElementLabelKey="modelCreate.addProperty"
                    elements={properties}
                    handleEditElement={handleSelectProperty}
                    handleNewElement={handleClickAddProperty}
                    handleDeleteElement={handleDeleteProperty} />
            </BaseForm>
        }

        {mode === CreateRelationshipMode.PropertyForm
            && <CreatePropertyForm
                t={t}
                onCancel={backToRelationshipForm}
                onPrimaryAction={handlePropertyFormAction}
                pushBreadcrumb={pushBreadcrumb}
                popBreadcrumb={popBreadcrumb}
                propertyToEdit={propertyToEdit.property} />}
    </>;
}

export default CreateRelationshipForm;