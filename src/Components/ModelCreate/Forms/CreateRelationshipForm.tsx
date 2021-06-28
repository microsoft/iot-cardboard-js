import React, { useState } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { ActionButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { SpinButton } from '@fluentui/react/lib/SpinButton';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { TextField } from '@fluentui/react/lib/TextField';
import { Text } from '@fluentui/react/lib/Text';
import { Separator } from '@fluentui/react/lib/Separator';
import { IIconProps } from '@fluentui/react';
import { DTDLProperty, DTDLRelationship } from '../../../Models/Classes/DTDL';
import CreatePropertyForm from './CreatePropertyForm';

const addIcon: IIconProps = { iconName: 'Add' };

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

    const initialRelationship = relationshipToEdit ?? DTDLRelationship.getBlank();
    const [id, setId] = useState(initialRelationship['@id']);
    const [name, setName] = useState(initialRelationship.name);
    const [displayName, setDisplayName] = useState(initialRelationship.displayName);
    const [description, setDescription] = useState(initialRelationship.description);
    const [comment, setComment] = useState(initialRelationship.comment);
    const [maxMultiplicity, setMaxMultiplicity] = useState(initialRelationship.maxMultiplicity?.toString());
    const [target, setTarget] = useState<IDropdownOption>();
    const [writable, setWritable] = useState(initialRelationship.writable);
    const [properties, setProperties] = useState([]);

    const onClickCreate = () => {
        const relationship = new DTDLRelationship(
            id,
            name, 
            displayName, 
            description, 
            comment,
            writable);
        onPrimaryAction(relationship);
    }

    const schemaOptions: IDropdownOption[] = [
        { key: 'any', text: t('modelCreate.anyInterface') },
    ];

    existingModelIds.forEach(modelId => {
        schemaOptions.push({ key: modelId, text: modelId });
    });

    const onClickAddProperty = () => {
        setMode(CreateRelationshipMode.PropertyForm);
        pushBreadcrumb('modelCreate.addProperty');
    }

    const handleCreateProperty = (newProperty: DTDLProperty) => {
        setProperties(currentProperties => {
            return [
                ...currentProperties,
                newProperty
            ];
        });
        backToRelationshipForm();
    };

    const backToRelationshipForm = () => {
        setMode(CreateRelationshipMode.RelationshipForm);
        popBreadcrumb();
    };

    return <>
        {mode === CreateRelationshipMode.RelationshipForm && <>
            <TextField
                label={t('modelCreate.relationshipId')}
                prefix="dtmi;"
                suffix=";1"
                value={id}
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
                onChange={(_e, checked) => setWritable(checked)} />
            <Stack>
                <Separator>{t('modelCreate.properties')}</Separator>
                    {properties.length === 0 && <Text>{t('modelCreate.noProperties')}</Text>}
                    {properties.length > 0 && <Stack>
                            {properties.map(p=> <DefaultButton key={`p-${p['@id']}`}>{p.displayName}</DefaultButton>)}
                        </Stack>}
                    <ActionButton 
                        iconProps={addIcon}
                        onClick={onClickAddProperty}>
                        {t('modelCreate.addProperty')}
                    </ActionButton>
            </Stack>
            <Stack horizontal>
                <DefaultButton onClick={onCancel}>{t('modelCreate.cancel')}</DefaultButton>
                <PrimaryButton onClick={onClickCreate}>
                    {
                        relationshipToEdit === null 
                            ? t('modelCreate.create')
                            : t('modelCreate.save')
                    }
                </PrimaryButton>
            </Stack>
        </>}

        {mode === CreateRelationshipMode.PropertyForm
            && <CreatePropertyForm
                t={t}
                onCancel={backToRelationshipForm}
                onPrimaryAction={handleCreateProperty}
                pushBreadcrumb={pushBreadcrumb}
                popBreadcrumb={popBreadcrumb} />}
    </>;
}

export default CreateRelationshipForm;